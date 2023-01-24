import { Injectable } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ConfirmModalComponent } from "./confirm-modal/confirm-modal.component";

@Injectable({
  providedIn: 'root'
})
export class AlertModalService {

  constructor(private modalService: BsModalService) {}

showConfirm(title: string, msg: string, okTxt?: string, cancelTxt?: string) {
  const bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent);
  bsModalRef.content.title = title;
  bsModalRef.content.msg = msg;

  if (okTxt) {
    bsModalRef.content.okTxt = okTxt;
  }

  if (cancelTxt) {
    bsModalRef.content.cancelTxt = cancelTxt;
  }

  return (<ConfirmModalComponent>bsModalRef.content).confirmResult;
}
}

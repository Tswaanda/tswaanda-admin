import React from "react";
import {
  AdminKYCUpdate,
  AdminMessage,
  AdminOrderUpdate,
  AppMessage,
} from "../../declarations/tswaanda_backend/tswaanda_backend.did";
import { useAuth } from "../../hooks/auth";
import { Button } from "@mui/material";

const NotificationsPage = () => {
  const { ws } = useAuth();

  /******************************************************
   *Websockets messages ttesting
   ******************************************************/

  const sendOrderUpdateWSMessage = async (status: string) => {
    let orderMsg: AdminOrderUpdate = {
      marketPlUserclientId:
        "vnw6d-awyvd-bvqjd-mxu3r-zwfmv-hnkt5-7b5j3-zttj6-gyyv3-urq3r-pqe",
      orderId: "2v7x3-4iaaa-aaaah-qaa4q-cai",
      status: { Approved: null },
      timestamp: BigInt(Date.now()),
    };
    let adminMessage: AdminMessage = {
      OrderUpdate: orderMsg,
    };
    const msg: AppMessage = {
      FromAdmin: adminMessage,
    };
    ws.send(msg);
  };

  const sendKYCUpdateWSMessage = async (status: string) => {
    let kycMsg: AdminKYCUpdate = {
      marketPlUserclientId:
        "vnw6d-awyvd-bvqjd-mxu3r-zwfmv-hnkt5-7b5j3-zttj6-gyyv3-urq3r-pqe",
      status: "Approved",
      message: "KYC Approved",
      timestamp: BigInt(Date.now()),
    };
    let adminMessage: AdminMessage = {
      KYCUpdate: kycMsg,
    };
    const msg: AppMessage = {
      FromAdmin: adminMessage,
    };
    ws.send(msg);
  };

  return (
    <div>
      {" "}
      <Button onClick={() => sendOrderUpdateWSMessage("Approved")}>
        Send Order Update
      </Button>
      <Button onClick={() => sendKYCUpdateWSMessage("Approved")}>
        Send KYC Update
      </Button>
    </div>
  );
};

export default NotificationsPage;

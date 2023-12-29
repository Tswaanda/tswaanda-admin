import React, { useEffect, useState, useRef } from "react";

const Transactions = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sendOfferDetailsToWallet = () => {
    const offerDetails = {
      type: "offer",
      value: {
        logo: "",
        logoWidth: 100,
        title: "",
        companyName: "Your Company",
        name: "",
        companyAddress: "",
        companyAddress2: "",
        companyCountry: "",
        billTo: "",
        clientName: "Clients Company",
        clientAddress: "",
        clientAddress2: "",
        clientCountry: "",
        invoiceTitleLabel: "",
        invoiceTitle: "",
        invoiceDateLabel: "",
        invoiceDate: "",
        invoiceDueDateLabel: "",
        invoiceDueDate: "",
        productLineDescription: "Product",
        productLineQuantity: "Quantity",
        productLineQuantityRate: "Rate",
        productLineQuantityAmount: "Amount",
        productLines: [
          {
            description: "",
            quantity: "",
            rate: "",
          },
        ],
        subTotalLabel: "Sub Total",
        taxLabel: "Sales Tax",
        totalLabel: "TOTAL",
        currency: "$",
        notesLabel: "Payment Method",
        notes: "Direct Payment",
        termLabel: "Terms & Conditions",
        // term: contractMarkdown,
      },
    };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(offerDetails),
        "*"
      );
    }
  };

  const sendSupportMessageToWallet = () => {
    let message = { type: "message", value: "Hello, how can I help you?" };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(JSON.stringify(message), "*");
    }
  };

  const sendCheckoutDetailsToWallet = () => {
    let purchaseDetails = { type: "name", value: "Tswaanda" };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(purchaseDetails),
        "*"
      );
    }
  };

  const sendPurchaseDetailsToWallet = () => {
    let purchaseDetails = {
      type: "purchase",
      value: {
        walletOwner: "",
        accountNumber: "",
        paymentDate: "",
        orderNumber: "",
      },
    };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(purchaseDetails),
        "*"
      );
    }
  };

  const sendExportDetailsToWallet = () => {
    let purchaseDetails = { type: "export", value: "" };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(purchaseDetails),
        "*"
      );
    }
  };

  const sendShipmentDetailsToWallet = () => {
    let purchaseDetails = { type: "shipment", value: "" };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(purchaseDetails),
        "*"
      );
    }
  };

  const sendFulfillmentDetailsToWallet = () => {
    let purchaseDetails = { type: "fulfillment", value: "" };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(purchaseDetails),
        "*"
      );
    }
  };

  const sendDisputeDetailsToWallet = () => {
    let purchaseDetails = { type: "dispute", value: "" };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(purchaseDetails),
        "*"
      );
    }
  };

  return (
    <div>
      <div>
        <button
          onClick={() => {
            sendCheckoutDetailsToWallet();
          }}
        >
          Checkout
        </button>
        <button
          onClick={() => {
            sendOfferDetailsToWallet();
          }}
        >
          Offer
        </button>
        <button
          onClick={() => {
            sendPurchaseDetailsToWallet();
          }}
        >
          Purchase
        </button>
        <button
          onClick={() => {
            sendExportDetailsToWallet();
          }}
        >
          Export
        </button>
        <button
          onClick={() => {
            sendShipmentDetailsToWallet();
          }}
        >
          Shipment
        </button>
        <button
          onClick={() => {
            sendFulfillmentDetailsToWallet();
          }}
        >
          Fulfillment
        </button>
        <button
          onClick={() => {
            sendDisputeDetailsToWallet();
          }}
        >
          Dispute
        </button>
        <button
          onClick={() => {
            sendSupportMessageToWallet();
          }}
        >
          Message
        </button>

        <iframe
          ref={iframeRef}
          src="https://5mrk6-yqaaa-aaaam-ab2iq-cai.raw.icp0.io"
          title="Checkout Iframe"
          width="750"
          height="950"
          suppressHydrationWarning={true}
          style={{ display: "block", border: "none", margin: "0 auto" }}
          sandbox="allow-same-origin allow-scripts"
        ></iframe>
      </div>
    </div>
  );
};

export default Transactions;

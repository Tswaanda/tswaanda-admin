import emailjs from "@emailjs/browser";


const updatedToApproved = "Great news! 🎉 Your order have been approved and is beeing processed. We will send you a more information about your order as soon as it is available. If you have any questions or need assistance, feel free to reach out."    
const updatedToShipped = "Your order has been shipped. We will send you a more information about your order as soon as it is available. If you have any questions or need assistance, feel free to reach out."
const updatedToDelivered = "Your order has been delivered. We hope you enjoy your purchase. If you have any questions or need assistance, feel free to reach out."


// TODO: CHANGE THE EMAIL TEMPLATE
export const sendAutomaticOrderUpdateEmail = async (
    name,
    email,
    status
) => {

    console.log(name, email, status)

    // function getStatusMessage(status) {
    //     if (status === "approved") {
    //         return updatedToApproved
    //     } else if (status === "shipped") {
    //         return updatedToShipped;
    //     } else if (status === "delivered") {
    //         return updatedToDelivered;
    //     }
    // }
    // const templateParams = {
    //     to_name: name,
    //     to_user_email: email,
    //     message: getStatusMessage(status),
    // };

    // emailjs
    //     .send(
    //         "service_515ffkj",
    //         "template_wcm2cyn",
    //         templateParams,
    //         "ni25KjXycoHjn-cD1"
    //     )
    //     .then(
    //         (result) => {
    //             console.log("SUCCESS!", result.status, result.text);
    //             console.log("message was sent");
    //         },
    //         (error) => {
    //             console.log(error);
    //         }
    //     );
};

// TODO: CHANGE THE EMAIL TEMPLATE

export const sendCustomerEmailMessageOnOrder = async (
    message,
    email,
) => {
    const templateParams = {
        to_user_email: email,
        message: message,
    };

    emailjs
        .send(
            "service_515ffkj",
            "template_mev2i6v",
            templateParams,
            "ni25KjXycoHjn-cD1"
        )
        .then(
            (result) => {
                console.log("SUCCESS!", result.status, result.text);
                console.log("message was sent");
            },
            (error) => {
                console.log(error);
            }
        );
};
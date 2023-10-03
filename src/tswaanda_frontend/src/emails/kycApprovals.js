import emailjs from "@emailjs/browser";

export const sendCustomerEmailMessage = async (
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

const hardmessage = "Great news! 🎉 Your KYC has been approved on our platform. You're all set to enjoy our services. If you have any questions or need assistance, feel free to reach out."

export const sendAutomaticEmailMessage = async (
    name,
    email,
) => {
    const templateParams = {
        to_name: name,
        to_user_email: email,
        message: hardmessage,
    };

    emailjs
        .send(
            "service_515ffkj",
            "template_wcm2cyn",
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
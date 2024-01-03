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
            "service_b0ld0fh",
            "template_59amz9z",
            templateParams,
            "cEuqVJj0eDt8tfwPN"
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
            "service_bsld0fh",
            "template_5oamz9z",
            templateParams,
            "cEuqVJj0eDt8tfwPN"
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
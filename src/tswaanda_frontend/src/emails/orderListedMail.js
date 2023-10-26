import emailjs from "@emailjs/browser";

export const sendOrderListedEmail = async (email, update) => {
    const templateParams = {
        to_user_email: email,
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
"use client"

import { useState } from "react";
import style from "./contact.module.css";
import emailjs from "@emailjs/browser";


export default function Contact() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<null | string>(null);

  const SERVICE_ID = "service_kz9xcfa";
  const TEMPLATE_ID_1 = "template_mbh71i3";
  const TEMPLATE_ID_2 = "template_zpr05bs";
  const PUBLIC_KEY = "kha2bU1tDlmvdOBEj";


  const handleClick = async (e: React.MouseEvent<HTMLInputElement>) => {

    e.preventDefault()

    const form = document.getElementById("contact-form") as HTMLFormElement | null;
    if (!form) {
      console.error("Form not found");
      return;
    }

    const formData = new FormData(form);
    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const message = formData.get("message") as string | null;

    if (!name || !email || !message) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID_1, form, PUBLIC_KEY);
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID_2, form, PUBLIC_KEY);
      setName("");
      setEmail("");
      setMessage("");
      setError(null);
      form.reset();
    }
    catch (err){
      console.error(err);
      setError("Something went wrong.");
    } finally {
    }



  }


  return (
    <div>
      <div className={style.gradientContainer}>
        <h1 className={style.pageTitle}>Contact</h1>
      </div>

      <div className={style.contact}>
        <div className={style.schoolContainer}>
          <div className = {style.errorText}>{error}</div>
          <form id="contact-form">
            <label className={style.contactText} htmlFor="name">Name</label>
            <br /><br />
            <input
              className={style.input}
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              required
            />
            <br /><br />

            <label className={style.contactText} htmlFor="email">Email</label>
            <br /><br />
            <input
              className={style.input}
              type="email"
              id="email"
              name="email"
              placeholder="Email"
            />
            <br /><br />

            <label className={style.contactText} htmlFor="message">Message</label>
            <br /><br />
            <textarea
              id="message"
              name="message"
              placeholder="Message"
              required
              className={style.input}
            ></textarea>
            <br /><br />

            <input
              className={style.submit}
              type="submit"
              onClick = {handleClick}
              value="Submit"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

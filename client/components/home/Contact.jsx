import React from "react";

const ContactPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
          <p>Email: contact@example.com</p>
          <p>Phone: +1234567890</p>
          <p>Address: 123 Main Street, City, Country</p>
        </div>
        <div className="border rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Contact Form</h2>
          {/* You can implement a contact form here */}
          <form>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="border rounded-md py-1 px-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border rounded-md py-1 px-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="border rounded-md py-1 px-2 w-full"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

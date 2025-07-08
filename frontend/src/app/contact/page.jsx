export default function Contact() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 pt-20">
      <div className="mx-auto max-w-lg px-4 py-8 w-full bg-white shadow rounded-lg">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-700 mb-6">Have a question or feedback? Fill out the form below and we'll get back to you soon!</p>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-blue-700 mb-1">Name</label>
            <input id="name" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-700 mb-1">Email</label>
            <input id="email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-blue-700 mb-1">Message</label>
            <textarea id="message" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-vertical" required />
          </div>
          <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md transition-colors">Send Message</button>
        </form>
      </div>
    </main>
  );
} 
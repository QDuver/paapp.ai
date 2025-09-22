import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-8 py-4">
          <div className="logo">
            <h2 className="text-blue-600 text-3xl font-bold">AiApps</h2>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-24 px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Personalized Applications Built Just for You
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed opacity-90 max-w-3xl mx-auto">
              At AiApps, we create custom applications tailored to your unique needs. 
              Whether you need a business solution, personal productivity tool, or something entirely different, 
              we build apps that fit your specific requirements.
            </p>
          </div>
        </section>

        <section className="py-20 px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-16">Why Choose AiApps?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Tailored Solutions</h3>
                <p className="text-gray-600 leading-relaxed">Every app we build is designed specifically for your needs, not generic one-size-fits-all solutions.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast Development</h3>
                <p className="text-gray-600 leading-relaxed">Our streamlined process gets your custom application up and running quickly without compromising quality.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Modern Technology</h3>
                <p className="text-gray-600 leading-relaxed">We use the latest technologies and best practices to ensure your app is fast, secure, and scalable.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Let's discuss your project and see how we can build the perfect application for you. 
              Every great app starts with a conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                Get in Touch
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-4 px-8 rounded-lg text-lg transition-all">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-300">&copy; 2025 AiApps. Building personalized applications that matter.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
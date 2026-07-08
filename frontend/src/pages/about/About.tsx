import { useNavigate } from 'react-router-dom';


function About() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">About ShopWithHarsh</h1>
          <p className="text-xl text-blue-100">Your trusted destination for quality products</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Founded in 2024, ShopWithHarsh began with a simple mission: to provide quality products at affordable prices with exceptional customer service.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            We believe in building lasting relationships with our customers and delivering an unmatched shopping experience.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-blue-600">Quality Products</h3>
              <p className="text-gray-600">We curate only the best products for our customers</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-blue-600">Fast Shipping</h3>
              <p className="text-gray-600">Quick and reliable delivery to your doorstep</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-blue-600">24/7 Support</h3>
              <p className="text-gray-600">Dedicated customer support whenever you need us</p>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Get In Touch</h2>
          <p className="text-gray-600 mb-4">Have questions? We'd love to hear from you.</p>
          <button onClick={()=>navigate("/contract")} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Contact Us
            
          </button>
        </section>
      </div>
    </div>
  )
}

export default About
interface ContractItem {
  id: string;
  title: string;
  description: string;
}

const contractItems: ContractItem[] = [
  {
    id: '1',
    title: 'Terms of Service',
    description: 'By using our platform, you agree to comply with all applicable laws and regulations.'
  },
  {
    id: '2',
    title: 'User Responsibilities',
    description: 'Users are responsible for maintaining the confidentiality of their accounts and passwords.'
  },
  {
    id: '3',
    title: 'Payment Terms',
    description: 'All payments must be made through authorized payment methods. Refunds are processed within 7-10 business days.'
  },
  {
    id: '4',
    title: 'Intellectual Property',
    description: 'All content on this platform is the intellectual property of our company or its content suppliers.'
  },
  {
    id: '5',
    title: 'Limitation of Liability',
    description: 'We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.'
  }
];

function Contract() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
        <p className="text-gray-600 mb-8">Last updated: January 2024</p>
        
        <div className="space-y-6">
          {contractItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{item.title}</h2>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <p className="text-gray-700">
            If you have any questions about these terms, please contact us at <span className="font-semibold">support@shopwithharsh.com</span>
          </p>
        </div>

        <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
          I Agree to the Terms & Conditions
        </button>
      </div>
    </div>
  )
}

export default Contract
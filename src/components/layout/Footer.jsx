const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-sm text-gray-300 mb-2">
            公益社団法人全日本トラック協会　女性部会
          </p>
          <p className="text-xs text-gray-400">
            &copy; {currentYear} All Japan Trucking Association. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

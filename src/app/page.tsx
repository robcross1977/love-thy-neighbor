import Link from "next/link";
import {
  Heart,
  MapPin,
  Users,
  Scissors,
  Star,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="verse-fade-in">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23059669%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%227%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

        <div className="verse-container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
              <Scissors className="w-4 h-4 mr-2" />
              Lawn Care Community
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Love Thy Neighbor
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connecting elderly neighbors in{" "}
              <span className="font-semibold text-green-700">
                Purcell and Lexington
              </span>{" "}
              with caring volunteers who help keep yards beautiful and
              well-maintained.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/causes"
                className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center">
                  <Scissors className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Volunteer to Help
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              </Link>

              <Link
                href="/create"
                className="px-8 py-4 border-2 border-green-600 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200 hover:shadow-md"
              >
                Request Lawn Care Help
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                100% Free
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Local Community
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Verified Helpers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="verse-container">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple Lawn Care Assistance
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Every neighbor deserves a beautiful yard, regardless of age or
              physical ability. We make it easy to connect and help each other.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-lg transition-all duration-300 border border-red-100">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                For Elderly Neighbors
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Request help with mowing, trimming, and basic yard maintenance
                when physical limitations make it challenging.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-300 border border-blue-100">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                For Caring Volunteers
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Find nearby elderly neighbors who need lawn care assistance and
                make a real difference in your community.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-300 border border-green-100">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Local Community
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Focused on Purcell and Lexington areas, connecting neighbors who
                live close to each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="verse-container">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Getting lawn care help is simple and straightforward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center mb-6 text-2xl font-bold shadow-lg">
                1
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Request Help
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Elderly neighbors post their lawn care needs including yard
                  size, preferred timing, and any special requirements.
                </p>
              </div>
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-green-300 to-transparent -translate-x-10"></div>
            </div>

            <div className="relative text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center mb-6 text-2xl font-bold shadow-lg">
                2
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Volunteers Respond
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Local volunteers see nearby requests and offer to help with
                  mowing, trimming, or other yard work.
                </p>
              </div>
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-transparent -translate-x-10"></div>
            </div>

            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mb-6 text-2xl font-bold shadow-lg">
                3
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Get It Done
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Neighbors connect directly to coordinate timing and complete
                  the lawn care with kindness and care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="verse-container">
          <div className="text-center text-white mb-8">
            <h3 className="text-2xl font-bold mb-2">
              Ready to Make a Difference
            </h3>
            <p className="text-green-100">
              We&apos;re just getting started in Purcell and Lexington!
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">New</div>
              <div className="text-green-100">Community Platform</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
              <div className="text-green-100">Free Service</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">2</div>
              <div className="text-green-100">Local Cities</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">∞</div>
              <div className="text-green-100">Potential Impact</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="verse-container">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 border border-green-100">
            <Star className="mx-auto w-16 h-16 text-yellow-500 mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Whether you need lawn care help or want to volunteer, join our
              caring community today and make a difference in your neighborhood.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create"
                className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-center">
                  <Scissors className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Request Lawn Care
                </div>
              </Link>
              <Link
                href="/causes"
                className="px-8 py-4 border-2 border-green-600 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200 hover:shadow-md"
              >
                Volunteer to Help
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

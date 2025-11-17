import React from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const About = () => {
  const values = [
    {
      icon: "Heart",
      title: "Quality First",
      description: "We meticulously curate every piece to ensure the highest standards of craftsmanship and materials."
    },
    {
      icon: "Sparkles",
      title: "Sustainable Fashion",
      description: "Committed to ethical production and environmentally responsible practices in everything we do."
    },
    {
      icon: "Users",
      title: "Customer Centric",
      description: "Your satisfaction is our priority. We listen, learn, and continuously improve our offerings."
    },
    {
      icon: "TrendingUp",
      title: "Style Innovation",
      description: "Blending timeless elegance with contemporary trends to create collections that inspire."
    }
  ];

  const collections = [
    {
      name: "Elegant Essentials",
      image: "👗",
      description: "Timeless pieces that form the foundation of every wardrobe"
    },
    {
      name: "Modern Luxe",
      image: "✨",
      description: "Contemporary designs with premium finishes and attention to detail"
    },
    {
      name: "Seasonal Vibes",
      image: "🌸",
      description: "Fresh collections inspired by the latest fashion trends"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-accent/10 rounded-full px-4 py-2">
                  <ApperIcon name="Sparkles" className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-accent">About Vogue Threads</span>
                </div>

                <h1 className="font-display text-5xl lg:text-6xl font-bold text-primary leading-tight">
                  Redefining Elegance
                </h1>

                <p className="text-lg text-gray-600 leading-relaxed">
                  Welcome to Vogue Threads, where fashion meets sophistication. Since our founding, we've been dedicated to bringing you the finest curated collections that celebrate your unique style and personality.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-accent to-yellow-500 hover:from-yellow-500 hover:to-accent">
                    <ApperIcon name="ShoppingBag" className="w-4 h-4 mr-2" />
                    Shop Collection
                  </Button>
                </Link>
                <Button variant="secondary" className="w-full sm:w-auto">
                  <ApperIcon name="Heart" className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative hidden lg:block">
              <div className="w-full h-96 bg-gradient-to-br from-accent/20 to-yellow-500/10 rounded-3xl flex items-center justify-center">
                <ApperIcon name="Sparkles" className="w-32 h-32 text-accent opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            To empower individuals through fashion that tells their story. We believe that every person deserves to feel confident and beautiful in what they wear. Our mission is to curate collections that inspire, elevate, and celebrate the diversity of modern style while maintaining our commitment to quality, sustainability, and exceptional customer service.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary text-center mb-16">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ApperIcon name={value.icon} className="w-6 h-6 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary text-center mb-16">Featured Collections</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <div
                key={collection.name}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/5 to-yellow-500/5 p-8 hover:from-accent/10 hover:to-yellow-500/10 transition-all duration-300"
              >
                <div className="text-6xl mb-6">{collection.image}</div>
                <h3 className="font-display text-2xl font-bold text-primary mb-3">
                  {collection.name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {collection.description}
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center text-accent hover:text-yellow-500 font-medium transition-colors duration-200"
                >
                  Explore Collection
                  <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent to-yellow-500 p-12 md:p-16">
            <div className="absolute inset-0 opacity-10">
              <ApperIcon name="Sparkles" className="w-96 h-96 text-white absolute -top-20 -right-20" />
            </div>

            <div className="relative z-10 text-center space-y-6">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">
                Ready to Elevate Your Style?
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                Discover our carefully curated collections and find pieces that resonate with your personal style.
              </p>
              <Link to="/products">
                <Button className="bg-white text-accent hover:bg-gray-50 font-semibold">
                  <ApperIcon name="ShoppingBag" className="w-4 h-4 mr-2" />
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="text-gray-600">
            Have questions? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="flex items-center space-x-2 text-gray-600">
              <ApperIcon name="Mail" className="w-4 h-4" />
              <span>support@voguethreads.com</span>
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center space-x-2 text-gray-600">
              <ApperIcon name="Phone" className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
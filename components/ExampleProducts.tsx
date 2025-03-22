'use client';
import { Card } from "@/components/ui/card";

const EXAMPLE_PRODUCTS = [
  { 
    name: 'Chocolate Bar',
    description: 'Parle Hide & Seek Chocolate Cookies',
    image: '/images/hide_and_seek.jpg',
    icon: '🍫'
  },
  { 
    name: 'Energy Drink',
    description: 'Bournvita Health Drink Mix',
    image: '/images/bournvita.jpg',
    icon: '🥤'
  },
  { 
    name: 'Potato Chips',
    description: 'Lays Classic Salted Chips',
    image: '/images/lays.jpg',
    icon: '🥔'
  },
  { 
    name: 'Shampoo',
    description: 'Hair Care Product',
    image: '/images/shampoo.jpg',
    icon: '🧴'
  },
];

export default function ExampleProducts({ 
  onSelect 
}: { 
  onSelect: (imageData: string) => void 
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {EXAMPLE_PRODUCTS.map((product) => (
        <Card
          key={product.name}
          className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
          onClick={() => onSelect(product.image)}
        >
          {/* Product Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{product.icon}</span>
              <h3 className="font-semibold text-lg text-gray-900">
                {product.name}
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              {product.description}
            </p>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-sm font-medium text-gray-900">
                Click to Analyze
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
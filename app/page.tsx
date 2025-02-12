import { ArrowRight, Leaf, Recycle, Users, Coins,MapPin, ChevronRight, } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function AnimatedGlobe(){
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-pulse"></div>
      <div className="absolute inset-2 rounded-full bg-green-400 opacity-40 animate-ping"></div>
      <div className="absolute inset-4 rounded-full bg-green-300 opacity-60 animate-spin"></div>
      <div className="absolute inset-6 rounded-full bg-green-200 opacity-80 animate-bounce"></div>
      <Leaf className="absolute inset-0 m-auto h-16 w-16 text-green-600 animate-pulse"/>

    </div>
  );
}

export default function Home(){
  return (
    <div className="container m-auto px-4 py-16">
      <section className="text-center mb-20">
        <AnimatedGlobe />
        <h1 className="text-6xl font-bold mb-6 text-gray-800 tracking-tight">
          Zero-to-Hero <span className="text-green-600">Waste Management</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Join our community in making wate management more efficient and rewarding
        </p>
        <Button className="bg-green-600 hover:bg-green-700 text-white text-lg py-6 px-10 rounded-full">
          Report Waste
        </Button>
      </section>

      <section>

      </section>
      
    </div>
  );
}

function FeatureCard({icon:Icon, title, description}:{icon: React.ElementType; title:string; description:string}){
  return(
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 
    ease-in-out flex flex-col items-center text-center">

    </div>
  )
}
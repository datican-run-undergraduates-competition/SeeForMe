import React from "react"
import Book from "../images/books.png"

const resources = [
  {
    title: "Color Blindness Simulator",
    description: "Test how your images appear to people with different types of color blindness.",
    link: "https://www.color-blindness.com/coblis-color-blindness-simulator/",
    type: "tool",
  },
  {
    title: "Understanding Color Blindness",
    description: "An article explaining the types, causes, and experiences of color blindness.",
    link: "https://www.aao.org/eye-health/diseases/what-is-color-blindness",
    type: "article",
  },
  {
    title: "Accessible Color Palette Generator",
    description: "Generate color palettes that are accessible for people with color vision deficiencies.",
    link: "https://coolors.co/contrast-checker/112a46-acc8e5",
    type: "tool",
  },
]

export default function ResourcesSection() {
  return (
    <div className="max-w-7xl items-center justify-center m-auto w-full">
      <div className="flex flex-col p-2 gap-8 text-center m-auto items-center 
        justify-center mt-4 md:text-start md:items-start md:gap-2 md:flex md:flex-row md:justify-between md:px-16">
        <div className="hero-text md:mt-20">
          <h1 className="text-3xl lg:text-5xl leading-tight mb-4 font-bold ">
            <span className="text-emerald-600">Empowering You</span> with
            <br />
            the Right Tools
          </h1>
          <p className="text-lg mb-8">
            Discover articles, guides, and external tools to help you or your loved ones live and navigate with
            confidence.
          </p>
        </div>
        <div className="">
          <img
            src={Book}
            alt="books"
            className="w-[65%] md:mt-8 md:w-[90%] lg:w-3/4 h-auto m-auto md:mr-4"
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-center mb-2">Featured Resources</h3>
        <p className="text-center mb-8 max-w-2xl mx-auto">
          Discover curated tools and guides to support your needs and make the digital world more inclusive.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {resources.map((res) => (
            <a
              key={res.title}
              href={res.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h4 className="font-semibold text-lg mb-2">{res.title}</h4>
              <p className="mb-3">{res.description}</p>
              <span className="inline-block text-emerald-600 text-sm font-medium capitalize">
                {res.type}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
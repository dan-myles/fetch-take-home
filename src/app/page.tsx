"use client";

import { LoginForm } from "@/components/login-form";

const Page = () => {
  return (
    <main className="flex-grow">
      <section>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Your Next
              <br />
              <span className="text-purple-600">Dream Dog.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Hey there recruiter, or maybe engineer. Welcome to PawLookup!
              Thanks for taking the time to check this site out.
            </p>
          </div>
          <div className="md:w-1/2 md:pl-10">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto">
              <LoginForm />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Hire Me</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                🤓
              </div>
              <h3 className="text-xl font-semibold mb-2">Super Nerdy</h3>
              <p className="text-gray-600">
                I love tech and love building on the web! CSS not so fun, but
                Javascript pretty fun.
              </p>
            </div>
            <div className="p-6 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                ⚡
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                I&apos;m a fast learner and I love to learn new things. I&apos;m
                constantly trying to stay up to date with everything web.
              </p>
            </div>
            <div className="p-6 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                💪
              </div>
              <h3 className="text-xl font-semibold mb-2">Dedicated</h3>
              <p className="text-gray-600">
                My dedication to quality is as strong as my interest in tech,
                meaning I&apos;ll tirelessly ensure the project&apos;s success
                and be a dedicated team member.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;

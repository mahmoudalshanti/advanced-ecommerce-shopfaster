import React from "react";
import Origin from "./_components/Origin";

export default async function Page() {
  return (
    <main className="max-w-md p-5 mx-auto mt-7">
      <p className="text-xl font-medium mb-3">Shopfaster</p>
      <p className="text-3xl font-semibold max-w-lg mb-3">
        Enter your email to join us or sign in.
      </p>
      <Origin />
    </main>
  );
}

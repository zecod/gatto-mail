import React from "react";
import Balancer from "react-wrap-balancer";

const HomeHeroSection = () => {
  return (
    <div className="text-center mt-20 space-y-6 py-10">
      <div>Email Finder</div>
      <h1 className="text-center text-4xl font-medium md:text-6xl">
        <Balancer className="mb-3 max-w-[1130px]">
          Find the verified email address of{" "}
          <span className="text-primary">any professional.</span>
        </Balancer>
      </h1>
    </div>
  );
};

export default HomeHeroSection;

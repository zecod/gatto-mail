import React from "react";
import HomeEmailFinder from "./email-finder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, Users } from "lucide-react";
import HomeEmailValidate from "./email-validate";

const HomeTabsManager = () => {
  return (
    <div className="w-full flex justify-center items-center mt-10">
      {" "}
      <Tabs defaultValue="find" className="w-full">
        <TabsList className="w-full flex items-center justify-center max-w-[280px] m-auto rounded-xl gaè-2">
          <TabsTrigger value="find" className="rounded-xl cursor-pointer">
            <Users /> Find by name
          </TabsTrigger>
          <TabsTrigger value="validate" className="rounded-xl cursor-pointer">
            <UserCheck />
            Validate email
          </TabsTrigger>
        </TabsList>
        <TabsContent value="find">
          <HomeEmailFinder />
        </TabsContent>
        <TabsContent value="validate">
          <HomeEmailValidate />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeTabsManager;

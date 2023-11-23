import React from "react";

const AboutPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: "John Doe",
      role: "CEO",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod nisl eget risus congue, sit amet auctor dolor tempor.",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "CTO",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod nisl eget risus congue, sit amet auctor dolor tempor.",
    },
    // Add more team members as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="border rounded-md p-4">
            <h2 className="text-lg font-semibold">{member.name}</h2>
            <p className="text-sm mb-2">{member.role}</p>
            <p>{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;

// components/Aside.js

import { useState } from 'react';

import { Template } from "@/interface/Template";
import { Blogpost } from "@/interface/Blogpost";

interface AsideProps {
  templates: Template[];
}

const Aside = ({templates}: AsideProps) => {
  const [visibleTemplates, setVisibleTemplates] = useState(3);

  const handleShowMoreTemplates = () => {
    setVisibleTemplates(visibleTemplates + 3);
    // onShowMorePosts();
  };


  return (
    <aside className="aside-container">
      {/* Templates Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Templates</h2>
        <ul className="space-y-2">
          {templates.slice(0, visibleTemplates).map((temp) => (
            <li key={temp.id} className="p-4 bg-white rounded-md shadow-md hover:bg-gray-50 transition duration-200">
              {/* Link to individual template */}
              <a href={`/template/${temp.id}`} className="block">
                {/* Template Title */}
                <h3 className="font-semibold text-lg">{temp.title}</h3>
                {/* Template Excerpt */}
                <p className="mt-2 text-sm text-gray-600">{temp.code}</p>
              </a>
            </li>
          ))}
        </ul>
        {templates.length > visibleTemplates && (
          <button onClick={handleShowMoreTemplates} className="mt-4 text-blue-500">Show More</button>
        )}
      </div>
    </aside>
  );
};

export default Aside;

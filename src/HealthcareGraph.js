import React, { useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import graphData from './data/graphData.json'; 

export default function HealthcareGraph() {
  const fgRef = useRef();
  const [selected, setSelected] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [clickedLink, setClickedLink] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = e => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    const match = graphData.nodes.find(n => n.id.toLowerCase().includes(query));
    if (match && fgRef.current) {
      fgRef.current.centerAt(match.x || 0, match.y || 0, 1000);
      fgRef.current.zoom(5, 1000);
      setSelected(match);
      setClickedLink(null);
      setHoveredLink(null);
    }
  };

  let details = "<strong>Select a node or edge</strong>";
  if (clickedLink) {
    details = `
      <strong>Connection Details</strong><br/>
      <strong>From:</strong> ${clickedLink.source.id}<br/>
      <strong>To:</strong> ${clickedLink.target.id}<br/>
      <strong>Type:</strong> ${clickedLink.label}
    `;
  } else if (hoveredLink) {
    details = `
      <strong>Connection:</strong> ${hoveredLink.label}<br/>
      <em>From:</em> ${hoveredLink.source.id}<br/>
      <em>To:</em> ${hoveredLink.target.id}
    `;
  } else if (selected) {
    details = `
      <strong>${selected.id}</strong><br/>
      <strong>Type:</strong> ${selected.labels}<br/>
    `;
  }

  return (
    <div className="h-screen flex">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search HCP by name or ID..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="absolute top-2.5 left-2.5 z-10 px-3 py-1.5 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          nodeLabel="id"
          linkLabel="label"
          nodeAutoColorBy="labels"
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
          onNodeClick={node => {
            setSelected(node);
            setClickedLink(null);
            setHoveredLink(null);
          }}
          onLinkHover={link => setHoveredLink(link)}
          onLinkClick={link => {
            setClickedLink(link);
            setSelected(null);
            setHoveredLink(null);
          }}
          onNodeHover={node => {
            if (!node) setHoveredLink(null);
          }}
          width={window.innerWidth * 0.7}
          height={window.innerHeight}
        />
      </div>
      <div className="w-80 p-4 bg-gray-50 overflow-y-auto border-l border-gray-200">
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: details }} 
        />
      </div>
    </div>
  );
}

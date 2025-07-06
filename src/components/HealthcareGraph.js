import React, { useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import graphData from '../data/graphData.json'; 

// Default doctor avatar image from public folder
const DOCTOR_AVATAR_SRC = "/Doctor.jpg";

export default function HealthcareGraph() {
  const fgRef = useRef();
  const [selected, setSelected] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
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

  // Determine which node to show in PeerSpace: clicked node takes priority over hover
  const activeNode = selected || hoveredNode;

  // PeerSpace panel UI
  const PeerSpacePanel = ({ node }) => {
    if (!node) return null;
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6 border mt-4 mx-auto max-w-4xl">
        {/* Avatar and basic info */}
        <div className="flex flex-col items-center md:w-1/3">
          <div className="w-24 h-24 mb-2">
            {node.image ? (
              <img
                src={node.image}
                alt={node.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
              />
            ) : (
              <img
                src={DOCTOR_AVATAR_SRC}
                alt="Doctor Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
              />
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800 mt-2">{node.name}</h2>
          <p className="text-blue-600 font-medium">{node.title}</p>
          <div className="mt-2 text-xs text-gray-500 text-center">
            {node.specialties && node.specialties.join(', ')}
          </div>
        </div>
        {/* Details */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="mb-2">
            <h3 className="font-semibold text-gray-700 mb-1">About</h3>
            <p className="text-gray-600 text-sm">{node.about}</p>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <div>
              <div className="flex items-center gap-1 font-semibold text-gray-700">
                <span role="img" aria-label="Education">🎓</span> Education
              </div>
              <ul className="text-xs text-gray-600 list-disc ml-5">
                {node.education && node.education.map((ed, i) => <li key={i}>{ed}</li>)}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-1 font-semibold text-gray-700">
                <span role="img" aria-label="Work">🏥</span> Work
              </div>
              <ul className="text-xs text-gray-600 list-disc ml-5">
                {node.work && node.work.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-1 font-semibold text-gray-700">
                <span role="img" aria-label="Publications">📄</span> Publications
              </div>
              <ul className="text-xs text-gray-600 list-disc ml-5">
                {node.publications && node.publications.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Search Bar */}
      <div className="bg-white shadow p-4">
        <input
          type="text"
          placeholder="Search HCP by name or ID..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Main Graph Area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
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
            onNodeHover={node => {
              setHoveredNode(node);
            }}
            onLinkHover={link => setHoveredLink(link)}
            onLinkClick={link => {
              setClickedLink(link);
              setSelected(null);
              setHoveredLink(null);
            }}
            width={window.innerWidth * 0.7}
            height={window.innerHeight * 0.7}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const isSelected = selected && node.id === selected.id;
              const size = 4;
              const img = new window.Image();
              img.src = node.image || DOCTOR_AVATAR_SRC;
              // Draw highlight if selected
              if (isSelected) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(node.x, node.y, size + 1, 0, 2 * Math.PI, false);
                ctx.strokeStyle = '#2563eb'; // blue-600
                ctx.lineWidth = 1.5;
                ctx.shadowColor = '#2563eb';
                ctx.shadowBlur = 1.5;
                ctx.stroke();
                ctx.restore();
              }
              // Draw node image or circle
              ctx.save();
              ctx.beginPath();
              ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
              ctx.closePath();
              ctx.clip();
              ctx.drawImage(img, node.x - size, node.y - size, size * 2, size * 2);
              ctx.restore();
            }}
          />
        </div>
        {/* PeerSpace Sidebar */}
        <div className="w-96 p-6 bg-gray-50 overflow-y-auto border-l border-gray-200 flex flex-col items-center">
          {/* Show PeerSpace details if a node is selected/hovered, else placeholder or link details */}
          {activeNode ? (
            <>
              <PeerSpacePanel node={activeNode} />
              {/* Peers list (avatars) */}
              <div className="bg-white border-b border-gray-200 px-2 py-4 w-full max-w-xs mx-auto mt-4 rounded-xl shadow">
                <h3 className="text-md font-semibold text-gray-800 mb-2">Connections</h3>
                <div className="flex gap-3 overflow-x-auto">
                  {graphData.links
                    .filter(link => link.source === activeNode.id || link.target === activeNode.id)
                    .map(link => {
                      const peerId = link.source === activeNode.id ? link.target : link.source;
                      const peer = graphData.nodes.find(n => n.id === peerId);
                      if (!peer) return null;
                      return (
                        <div
                          key={peer.id}
                          className="min-w-[80px] bg-gray-100 border rounded-lg shadow-sm p-2 hover:bg-blue-50 cursor-pointer"
                          onClick={() => {
                            setSelected(peer);
                            fgRef.current.centerAt(peer.x || 0, peer.y || 0, 1000);
                            fgRef.current.zoom(5, 1000);
                          }}
                        >
                          <div className="w-8 h-8 mx-auto mb-1">
                            {peer.image ? (
                              <img
                                src={peer.image}
                                alt={peer.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <img
                                src={DOCTOR_AVATAR_SRC}
                                alt="Doctor Avatar"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-xs truncate">{peer.name || peer.id}</p>
                            <p className="text-[10px] text-gray-500 truncate">{peer.title}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          ) : clickedLink ? (
            <div className="prose prose-sm max-w-none w-full">
              <strong>Connection Details</strong><br/>
              <strong>From:</strong> {clickedLink.source.id}<br/>
              <strong>To:</strong> {clickedLink.target.id}<br/>
              <strong>Type:</strong> {clickedLink.label}
            </div>
          ) : hoveredLink ? (
            <div className="prose prose-sm max-w-none w-full">
              <strong>Connection:</strong> {hoveredLink.label}<br/>
              <em>From:</em> {hoveredLink.source.id}<br/>
              <em>To:</em> {hoveredLink.target.id}
            </div>
          ) : (
            <div className="text-gray-400 text-center mt-20">
              <span className="text-4xl mb-2 block">👈</span>
              <div className="font-semibold">Select or hover a node to see PeerSpace details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

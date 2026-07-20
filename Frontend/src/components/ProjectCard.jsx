import React from 'react';

function ProjectCard({ project, children }) {
    return (
        <div className="project-card" style={{ position: 'relative', marginBottom: '20px' }}>
            <h3 className="card-title" style={{ paddingRight: '120px' }}>{project.title}</h3>
            <p className="card-desc">{project.description}</p>
            
            <div style={{ marginBottom: '16px' }}>
                {project.techStack && project.techStack.map((tech, index) => (
                    <span className="tech-tag" key={index}>{tech}</span>
                ))}
            </div>

            {/* This renders any custom action buttons (like Apply, Delete, or Accept/Decline) passed from pages */}
            {children}

            <div className="card-footer" style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #111' }}>
                <span>Proposed by: {project.author}</span>
                <span>Contact: {project.contactEmail}</span>
            </div>
        </div>
    );
}

export default ProjectCard;
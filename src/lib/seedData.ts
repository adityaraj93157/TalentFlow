import { Job, Candidate, Assessment, CandidateStage } from '@/types';

const departments = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR', 'Finance'];
const locations = ['San Francisco, CA', 'New York, NY', 'Remote', 'London, UK', 'Austin, TX'];
const jobTypes = ['full-time', 'part-time', 'contract', 'internship'] as const;
const candidateStages: CandidateStage[] = ['applied', 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected'];

const generateJobId = () => `job_${Math.random().toString(36).substr(2, 9)}`;
const generateCandidateId = () => `cand_${Math.random().toString(36).substr(2, 9)}`;

export const generateJobs = (): Job[] => {
  const jobTitles = [
    'Senior Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'DevOps Engineer',
    'UX Designer', 'Product Designer', 'UI/UX Designer', 'Graphic Designer',
    'Product Manager', 'Technical Product Manager', 'Senior Product Manager',
    'Marketing Manager', 'Digital Marketing Specialist', 'Content Marketing Manager',
    'Sales Representative', 'Account Executive', 'Sales Development Representative',
    'HR Business Partner', 'Recruiter', 'People Operations Manager',
    'Financial Analyst', 'Accounting Manager', 'Controller',
    'Data Scientist', 'Machine Learning Engineer', 'Data Analyst'
  ];

  return jobTitles.map((title, index) => {
    const id = generateJobId();
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    return {
      id,
      title,
      slug,
      department: departments[Math.floor(Math.random() * departments.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      type: jobTypes[Math.floor(Math.random() * jobTypes.length)],
      status: Math.random() > 0.8 ? 'archived' : Math.random() > 0.1 ? 'active' : 'draft',
      description: `We are looking for a ${title} to join our growing team. This role offers exciting opportunities to work on cutting-edge projects and make a significant impact.`,
      requirements: [
        '3+ years of relevant experience',
        'Strong communication skills',
        'Experience with modern tools and technologies',
        'Bachelor\'s degree or equivalent experience'
      ],
      tags: ['remote-ok', 'full-benefits', 'equity'],
      salary: Math.random() > 0.3 ? {
        min: 80000 + Math.floor(Math.random() * 100000),
        max: 120000 + Math.floor(Math.random() * 150000),
        currency: 'USD'
      } : undefined,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      order: index
    };
  });
};

export const generateCandidates = (jobs: Job[]): Candidate[] => {
  const firstNames = [
    'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
    'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rachel', 'Sam', 'Tara',
    'Alex', 'Blake', 'Casey', 'Drew', 'Emery', 'Finley', 'Gabriel', 'Harper', 'Jordan', 'Kendall',
    'Logan', 'Morgan', 'Peyton', 'Riley', 'Sage', 'Taylor', 'Avery', 'Cameron', 'Dakota', 'Ellis',
    'Hayden', 'Jamie', 'Kai', 'Lane', 'Max', 'Nico', 'Owen', 'Parker', 'Reese', 'Skylar',
    'Addison', 'Bennett', 'Carter', 'Delilah', 'Emilia', 'Felix', 'Gianna', 'Hudson', 'Isabella', 'Julian',
    'Katherine', 'Lucas', 'Madeline', 'Nathan', 'Olivia', 'Penelope', 'Quentin', 'Ruby', 'Sebastian', 'Theodore',
    'Uma', 'Violet', 'William', 'Xavier', 'Yara', 'Zoe', 'Aaron', 'Brooke', 'Chloe', 'Daniel',
    'Emma', 'Finn', 'Georgia', 'Hannah', 'Isaac', 'Jasmine', 'Kevin', 'Lily', 'Mason', 'Nora'
  ];
  
  const lastNames = [
    'Anderson', 'Brown', 'Chen', 'Davis', 'Evans', 'Foster', 'Garcia', 'Hall', 'Johnson', 'Kim',
    'Lee', 'Martinez', 'Nelson', 'O\'Connor', 'Patel', 'Quinn', 'Rodriguez', 'Smith', 'Taylor', 'Wilson',
    'Adams', 'Baker', 'Clark', 'Edwards', 'Flores', 'Green', 'Harris', 'Jackson', 'King', 'Lewis',
    'Miller', 'Moore', 'Parker', 'Robinson', 'Scott', 'Thomas', 'Walker', 'White', 'Young', 'Allen',
    'Bell', 'Campbell', 'Carter', 'Collins', 'Cook', 'Cooper', 'Cox', 'Cruz', 'Diaz', 'Fisher',
    'Gray', 'Henderson', 'Hughes', 'Jenkins', 'Kelly', 'Long', 'Mitchell', 'Murphy', 'Perez', 'Price',
    'Reed', 'Richardson', 'Rivera', 'Roberts', 'Sanchez', 'Sanders', 'Stewart', 'Turner', 'Ward', 'Watson',
    'Wright', 'Adams', 'Bailey', 'Carter', 'Collins', 'Cook', 'Cooper', 'Cox', 'Cruz', 'Diaz'
  ];

  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'C#', 'Go',
    'PHP', 'Ruby', 'Swift', 'Kotlin', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure', 'Docker',
    'Kubernetes', 'Git', 'Agile', 'Scrum', 'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Figma', 'Photoshop', 'Illustrator'
  ];

  const companies = [
    'TechCorp', 'InnovateLabs', 'DataFlow', 'CloudSoft', 'WebCraft', 'DevStudio', 'CodeForge', 'PixelWorks',
    'ByteStream', 'LogicGate', 'AppFactory', 'DigitalEdge', 'CyberSoft', 'InfoTech', 'NetSolutions', 'ProCode'
  ];
  
  const candidates: Candidate[] = [];
  
  // Generate exactly 100 candidates
  for (let i = 0; i < 100; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`;
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const stage = candidateStages[Math.floor(Math.random() * candidateStages.length)];
    const createdAt = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    
    // Generate some random notes
    const noteCount = Math.floor(Math.random() * 3);
    const notes = [];
    if (noteCount > 0) {
      const noteTexts = [
        'Strong technical background with excellent problem-solving skills.',
        'Great communication skills and team player.',
        'Previous experience in similar role.',
        'Passionate about technology and continuous learning.',
        'Available for immediate start.',
        'Looking for growth opportunities.',
        'Has relevant certifications.',
        'Referred by current employee.'
      ];
      
      for (let j = 0; j < noteCount; j++) {
        notes.push({
          id: `note_${Math.random().toString(36).substr(2, 9)}`,
          content: noteTexts[Math.floor(Math.random() * noteTexts.length)],
          author: 'HR Team',
          mentions: [],
          createdAt: new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        });
      }
    }

    // Generate timeline events
    const timeline = [
      {
        id: `timeline_${Math.random().toString(36).substr(2, 9)}`,
        type: 'stage_change' as const,
        description: `Applied for ${job.title}`,
        author: 'System',
        createdAt,
      }
    ];

    // Add more timeline events based on stage
    if (stage !== 'applied') {
      timeline.push({
        id: `timeline_${Math.random().toString(36).substr(2, 9)}`,
        type: 'stage_change' as const,
        description: `Moved to ${stage}`,
        author: 'HR Team',
        createdAt: new Date(createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }

    if (stage === 'interview') {
      timeline.push({
        id: `timeline_${Math.random().toString(36).substr(2, 9)}`,
        type: 'interview_scheduled' as const,
        description: 'Interview scheduled for next week',
        author: 'HR Team',
        createdAt: new Date(createdAt.getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000),
      });
    }
    
    candidates.push({
      id: generateCandidateId(),
      name,
      email,
      phone: Math.random() > 0.2 ? `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : undefined,
      jobId: job.id,
      stage,
      resume: Math.random() > 0.3 ? `https://example.com/resumes/${firstName.toLowerCase()}-${lastName.toLowerCase()}-resume.pdf` : undefined,
      notes,
      createdAt,
      updatedAt: createdAt,
      timeline
    });
  }
  
  return candidates;
};

export const generateAssessments = (jobs: Job[]): Assessment[] => {
  const assessmentTemplates = [
    {
      title: 'Frontend Developer Assessment',
      description: 'Comprehensive assessment for frontend development roles covering JavaScript, React, CSS, and problem-solving skills.',
      sections: [
        {
          title: 'Technical Skills',
          questions: [
            {
              type: 'single_choice' as const,
              title: 'What is your primary JavaScript framework/library?',
              required: true,
              options: ['React', 'Vue.js', 'Angular', 'Svelte', 'Vanilla JavaScript']
            },
            {
              type: 'multiple_choice' as const,
              title: 'Which CSS features are you comfortable with? (Select all that apply)',
              required: true,
              options: ['Flexbox', 'Grid', 'CSS Variables', 'Animations', 'Preprocessors (Sass/Less)']
            },
            {
              type: 'numeric' as const,
              title: 'How many years of frontend development experience do you have?',
              required: true,
              validation: { minValue: 0, maxValue: 20 }
            },
            {
              type: 'long_text' as const,
              title: 'Describe your experience with responsive web design and mobile-first development.',
              required: false,
              validation: { maxLength: 500 }
            }
          ]
        },
        {
          title: 'Problem Solving',
          questions: [
            {
              type: 'short_text' as const,
              title: 'How would you optimize a slow-loading React application?',
              required: true,
              validation: { maxLength: 200 }
            },
            {
              type: 'single_choice' as const,
              title: 'What is your preferred approach to state management in large applications?',
              required: true,
              options: ['Redux', 'Context API', 'Zustand', 'Jotai', 'Custom hooks']
            }
          ]
        }
      ]
    },
    {
      title: 'Backend Developer Assessment',
      description: 'Technical assessment for backend development positions focusing on API design, databases, and system architecture.',
      sections: [
        {
          title: 'Backend Technologies',
          questions: [
            {
              type: 'single_choice' as const,
              title: 'What is your preferred backend programming language?',
              required: true,
              options: ['Node.js', 'Python', 'Java', 'C#', 'Go', 'PHP']
            },
            {
              type: 'multiple_choice' as const,
              title: 'Which databases have you worked with? (Select all that apply)',
              required: true,
              options: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'DynamoDB']
            },
            {
              type: 'numeric' as const,
              title: 'Years of experience with RESTful API development?',
              required: true,
              validation: { minValue: 0, maxValue: 15 }
            },
            {
              type: 'long_text' as const,
              title: 'Explain your approach to handling authentication and authorization in web applications.',
              required: true,
              validation: { maxLength: 600 }
            }
          ]
        },
        {
          title: 'System Design',
          questions: [
            {
              type: 'short_text' as const,
              title: 'How would you design a scalable chat application?',
              required: true,
              validation: { maxLength: 300 }
            },
            {
              type: 'single_choice' as const,
              title: 'Which caching strategy do you prefer for high-traffic applications?',
              required: true,
              options: ['Redis', 'Memcached', 'In-memory caching', 'CDN caching', 'Database query caching']
            }
          ]
        }
      ]
    },
    {
      title: 'Product Manager Assessment',
      description: 'Assessment for product management roles covering strategy, user research, and cross-functional collaboration.',
      sections: [
        {
          title: 'Product Strategy',
          questions: [
            {
              type: 'single_choice' as const,
              title: 'What is your approach to prioritizing product features?',
              required: true,
              options: ['RICE Framework', 'MoSCoW Method', 'Kano Model', 'Value vs Effort Matrix', 'Customer Feedback Driven']
            },
            {
              type: 'multiple_choice' as const,
              title: 'Which tools do you use for product management? (Select all that apply)',
              required: true,
              options: ['Jira', 'Asana', 'Notion', 'Figma', 'Mixpanel', 'Google Analytics']
            },
            {
              type: 'numeric' as const,
              title: 'How many years of product management experience do you have?',
              required: true,
              validation: { minValue: 0, maxValue: 20 }
            },
            {
              type: 'long_text' as const,
              title: 'Describe a challenging product decision you had to make and how you handled stakeholder alignment.',
              required: true,
              validation: { maxLength: 800 }
            }
          ]
        },
        {
          title: 'User Research & Analytics',
          questions: [
            {
              type: 'short_text' as const,
              title: 'How do you measure product success and user satisfaction?',
              required: true,
              validation: { maxLength: 250 }
            },
            {
              type: 'single_choice' as const,
              title: 'What is your preferred method for gathering user feedback?',
              required: true,
              options: ['User Interviews', 'Surveys', 'Usability Testing', 'A/B Testing', 'Focus Groups']
            }
          ]
        }
      ]
    }
  ];

  return assessmentTemplates.map((template, index) => ({
    id: `assessment_${Math.random().toString(36).substr(2, 9)}`,
    jobId: jobs[index % jobs.length].id,
    title: template.title,
    description: template.description,
    sections: template.sections.map((section, sectionIndex) => ({
      id: `section_${Math.random().toString(36).substr(2, 9)}`,
      title: section.title,
      description: undefined,
      order: sectionIndex + 1,
      questions: section.questions.map((question, questionIndex) => ({
        id: `q_${Math.random().toString(36).substr(2, 9)}`,
        type: question.type,
        title: question.title,
        description: undefined,
        required: question.required,
        order: questionIndex + 1,
        options: question.options,
        validation: question.validation,
        conditionalLogic: undefined
      }))
    })),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));
};
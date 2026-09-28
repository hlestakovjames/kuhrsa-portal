export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  topic: string;
  topicSlug: string;
  contributor: string;
  contributorSlug: string;
  series?: string;
  seriesSlug?: string;
  date: string;
  readingTime: string;
  image: string;
  intro: string;
  content: string[];
  featured?: boolean;
  editorPick?: boolean;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "student-leadership-really-means",
    title: "What student leadership really means",
    category: "Student Perspectives",
    categorySlug: "student-perspectives",
    topic: "Leadership",
    topicSlug: "leadership",
    contributor: "KUHRSA Editorial Team",
    contributorSlug: "kuhrsa-editorial-team",
    series: "KUHRSA Leadership Stories",
    seriesSlug: "kuhrsa-leadership-stories",
    date: "2026",
    readingTime: "5 min read",
    image: "/images/kuhrsa/general/STD@HRSA.jpeg",
    intro:
      "Student leadership is about more than holding a title. It is about participation, responsibility and finding meaningful ways to contribute.",
    content: [
      "Leadership within a student association begins with participation. Students contribute ideas, take responsibility and work with others to create meaningful experiences for the wider community.",
      "For KUHRSA, leadership can take many forms. It can mean organizing activities, supporting fellow students, contributing to academic initiatives or helping shape the direction of the association.",
      "The strongest student leaders are often those who understand that leadership is closely connected to service, collaboration and responsibility.",
    ],
    featured: true,
    editorPick: true,
  },
  {
    slug: "building-professional-connections",
    title: "Building professional connections while at university",
    category: "Career & Professional Growth",
    categorySlug: "career-professional-growth",
    topic: "Career & Professional Growth",
    topicSlug: "career-professional-growth",
    contributor: "KUHRSA Editorial Team",
    contributorSlug: "kuhrsa-editorial-team",
    series: "Career Conversations",
    seriesSlug: "career-conversations",
    date: "2026",
    readingTime: "6 min read",
    image: "/images/kuhrsa/general/hrsa.students.jpeg",
    intro:
      "Professional relationships built during university can become an important part of long-term career development.",
    content: [
      "University provides more than classroom learning. It also creates opportunities to meet people, exchange ideas and develop relationships that can continue beyond graduation.",
      "Students can strengthen their professional networks by participating in associations, mentorship activities, career programs, events and collaborative projects.",
      "The goal is not simply to collect contacts. Strong professional connections are built through genuine interaction, mutual support and continued learning.",
    ],
    featured: true,
  },
  {
    slug: "finding-your-place-kuhrsa",
    title: "Finding your place in the KUHRSA community",
    category: "Student Life",
    categorySlug: "student-life",
    topic: "Student Life",
    topicSlug: "student-life",
    contributor: "KUHRSA Editorial Team",
    contributorSlug: "kuhrsa-editorial-team",
    date: "2026",
    readingTime: "4 min read",
    image: "/images/kuhrsa/general/STUDENTS.jpeg",
    intro:
      "Belonging to a student association can create opportunities to learn, contribute, connect and grow.",
    content: [
      "Every student brings different experiences, interests and ambitions into the university environment. A strong student community creates space for those differences to come together.",
      "KUHRSA provides opportunities for students to participate through academic initiatives, programs, activities, events and membership engagement.",
      "Finding your place often begins with one simple step: getting involved.",
    ],
  },
];
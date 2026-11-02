/** The existing public map baseline, shared without changing its records. */
export interface MapVenue {
    name: string;
    type: string;
    categories: string[];
    impact?: string; // Q1, Q2, Q3, Q4 or null
    cfpDeadline?: string; // For conferences
}

export const MAP_VENUES: MapVenue[] = [
    // Q1 Well-known Journals
    { name: "Educational Technology Research and Development", type: "Journal", categories: ["Well-known", "Instructional Design"], impact: "Q1" },
    { name: "Journal of the Learning Sciences", type: "Journal", categories: ["Well-known", "Learning Sciences"], impact: "Q1" },
    { name: "International Journal of Computer-Supported Collaborative Learning", type: "Journal", categories: ["Well-known", "Learning Sciences"], impact: "Q1" },
    { name: "Computers & Education", type: "Journal", categories: ["Well-known", "Technology-Enhanced Learning"], impact: "Q1" },
    { name: "British Journal of Educational Technology", type: "Journal", categories: ["Well-known", "Technology-Enhanced Learning"], impact: "Q1" },
    { name: "Learning and Instruction", type: "Journal", categories: ["Well-known", "Learning Sciences"], impact: "Q1" },
    { name: "Educational Psychology Review", type: "Journal", categories: ["Well-known", "Educational Psychology"], impact: "Q1" },
    { name: "Educational Psychologist", type: "Journal", categories: ["Well-known", "Educational Psychology"], impact: "Q1" },
    { name: "Review of Educational Research", type: "Journal", categories: ["Well-known", "Education Research"], impact: "Q1" },
    { name: "American Educational Research Journal", type: "Journal", categories: ["Well-known", "Education Research"], impact: "Q1" },
    { name: "Educational Researcher", type: "Journal", categories: ["Well-known", "Education Research"], impact: "Q1" },
    { name: "Journal of Educational Psychology", type: "Journal", categories: ["Well-known", "Educational Psychology"], impact: "Q1" },
    { name: "Cognition and Instruction", type: "Journal", categories: ["Well-known", "Learning Sciences"], impact: "Q1" },

    // Q2 Journals
    { name: "Journal of Computer Assisted Learning", type: "Journal", categories: ["Technology-Enhanced Learning"], impact: "Q1" },
    { name: "Journal of Educational Computing Research", type: "Journal", categories: ["Technology-Enhanced Learning"], impact: "Q1" },
    { name: "IEEE Transactions on Learning Technologies", type: "Journal", categories: ["Technology-Enhanced Learning", "Immersive Technology"], impact: "Q1" },
    { name: "International Journal of Artificial Intelligence in Education", type: "Journal", categories: ["AIED"], impact: "Q1" },
    { name: "User Modeling and User-Adapted Interaction", type: "Journal", categories: ["AIED"], impact: "Q1" },
    { name: "Journal of Learning Analytics", type: "Journal", categories: ["Learning Analytics"], impact: "Q2" },
    { name: "Instructional Science", type: "Journal", categories: ["Learning Sciences"], impact: "Q1" },
    { name: "Contemporary Educational Psychology", type: "Journal", categories: ["Educational Psychology"], impact: "Q1" },
    { name: "Learning and Individual Differences", type: "Journal", categories: ["Educational Psychology"], impact: "Q1" },
    { name: "Mind Culture and Activity", type: "Journal", categories: ["Learning Sciences"], impact: "Q2" },
    { name: "Educational Research Review", type: "Journal", categories: ["Education Research"], impact: "Q1" },
    { name: "Computers in Human Behavior", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q1" },
    { name: "Interactive Learning Environments", type: "Journal", categories: ["Technology-Enhanced Learning"], impact: "Q1" },
    { name: "Distance Education", type: "Journal", categories: ["Online Learning"], impact: "Q1" },
    { name: "Internet and Higher Education", type: "Journal", categories: ["Higher Education", "Online Learning"], impact: "Q1" },

    // Q3 Journals
    { name: "Computers & Education: Artificial Intelligence", type: "Journal", categories: ["AIED"], impact: "Q3" },
    { name: "Journal of Applied Instructional Design", type: "Journal", categories: ["Instructional Design"], impact: "Q3" },
    { name: "Journal of Formative Design in Learning", type: "Journal", categories: ["Instructional Design"], impact: "Q3" },
    { name: "International Journal of Designs for Learning", type: "Journal", categories: ["Instructional Design"], impact: "Q3" },
    { name: "TechTrends", type: "Journal", categories: ["Instructional Design"], impact: "Q3" },
    { name: "Performance Improvement Quarterly", type: "Journal", categories: ["Instructional Design"], impact: "Q3" },
    { name: "Educational Technology & Society", type: "Journal", categories: ["Technology-Enhanced Learning"], impact: "Q1" },
    { name: "Education and Information Technologies", type: "Journal", categories: ["Technology-Enhanced Learning"], impact: "Q1" },
    { name: "International Journal of Educational Technology in Higher Education", type: "Journal", categories: ["Higher Education"], impact: "Q1" },
    { name: "Journal of Computing in Higher Education", type: "Journal", categories: ["Higher Education"], impact: "Q1" },
    { name: "Online Learning Journal", type: "Journal", categories: ["Online Learning"], impact: "Q1" },
    { name: "International Review of Research in Open and Distributed Learning", type: "Journal", categories: ["Online Learning"], impact: "Q3" },
    { name: "International Journal of Human-Computer Interaction", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q1" },
    { name: "Human-Computer Interaction", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q1" },
    { name: "ACM Transactions on Computer-Human Interaction", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q1" },
    { name: "Behaviour & Information Technology", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q3" },
    { name: "International Journal of Child-Computer Interaction", type: "Journal", categories: ["Human-Computer Interaction"], impact: "Q3" },
    { name: "Simulation & Gaming", type: "Journal", categories: ["Immersive Technology"], impact: "Q3" },
    { name: "Virtual Reality", type: "Journal", categories: ["Immersive Technology"], impact: "Q3" },
    { name: "Computers & Education: X Reality", type: "Journal", categories: ["Immersive Technology"], impact: "Q3" },
    { name: "Learning Media and Technology", type: "Journal", categories: ["Technology-Enhanced Learning", "Critical Perspectives"], impact: "Q1" },

    // STEM Education Journals
    { name: "Journal of Research in Science Teaching", type: "Journal", categories: ["STEM Education"], impact: "Q1" },
    { name: "Science Education", type: "Journal", categories: ["STEM Education"], impact: "Q1" },
    { name: "International Journal of Science Education", type: "Journal", categories: ["STEM Education"], impact: "Q2" },
    { name: "Journal of Science Education and Technology", type: "Journal", categories: ["STEM Education"], impact: "Q2" },
    { name: "Studies in Science Education", type: "Journal", categories: ["STEM Education"], impact: "Q1" },
    { name: "Journal of Engineering Education", type: "Journal", categories: ["STEM Education"], impact: "Q1" },
    { name: "Computer Science Education", type: "Journal", categories: ["STEM Education"], impact: "Q3" },
    { name: "ACM Transactions on Computing Education", type: "Journal", categories: ["STEM Education"], impact: "Q2" },
    { name: "CBE-Life Sciences Education", type: "Journal", categories: ["STEM Education"], impact: "Q1" },
    { name: "Mathematics Education Research Journal", type: "Journal", categories: ["STEM Education"], impact: "Q3" },

    // Teacher Education Journals
    { name: "Journal of Teacher Education", type: "Journal", categories: ["Teacher Education"], impact: "Q1" },
    { name: "Teaching and Teacher Education", type: "Journal", categories: ["Teacher Education"], impact: "Q1" },
    { name: "European Journal of Teacher Education", type: "Journal", categories: ["Teacher Education"], impact: "Q1" },
    { name: "Teachers and Teaching: Theory and Practice", type: "Journal", categories: ["Teacher Education"], impact: "Q1" },
    { name: "Professional Development in Education", type: "Journal", categories: ["Teacher Education"], impact: "Q1" },
    { name: "Action in Teacher Education", type: "Journal", categories: ["Teacher Education"], impact: "Q2" },

    // Conferences
    { name: "ISLS Annual Meeting", type: "Conference", categories: ["Learning Sciences"], cfpDeadline: "November" },
    { name: "ICLS", type: "SubConference", categories: ["ISLS", "Learning Sciences"], cfpDeadline: "November" },
    { name: "CSCL", type: "SubConference", categories: ["ISLS", "Learning Sciences"], cfpDeadline: "November" },
    { name: "AERA Annual Meeting", type: "Conference", categories: ["Education Research"], cfpDeadline: "July" },
    { name: "EARLI Conference", type: "Conference", categories: ["Education Research"], cfpDeadline: "January" },
    { name: "LAK Conference", type: "Conference", categories: ["Learning Analytics"], cfpDeadline: "October" },
    { name: "EDM Conference", type: "Conference", categories: ["Learning Analytics"], cfpDeadline: "February" },
    { name: "AIED Conference", type: "Conference", categories: ["AIED"], cfpDeadline: "February" },
    { name: "ITS Conference", type: "Conference", categories: ["AIED"], cfpDeadline: "February" },
    { name: "CHI Conference", type: "Conference", categories: ["Human-Computer Interaction"], cfpDeadline: "September" },
    { name: "CSCW Conference", type: "Conference", categories: ["Human-Computer Interaction"], cfpDeadline: "April/November" },
    { name: "UIST Conference", type: "Conference", categories: ["Human-Computer Interaction"], cfpDeadline: "April" },
    { name: "IDC Conference", type: "Conference", categories: ["Human-Computer Interaction"], cfpDeadline: "January" },
    { name: "IEEE VR", type: "Conference", categories: ["Immersive Technology"], cfpDeadline: "September" },
    { name: "ISMAR", type: "Conference", categories: ["Immersive Technology"], cfpDeadline: "April" },
    { name: "AECT Convention", type: "Conference", categories: ["Instructional Design"], cfpDeadline: "March" },
    { name: "ETRA Symposium", type: "Conference", categories: ["Human-Computer Interaction", "Eye-tracking"], cfpDeadline: "January" },
    { name: "L@S Conference", type: "Conference", categories: ["Online Learning", "Learning Analytics", "Learning at Scale"], cfpDeadline: "January" },
    { name: "SIGCSE Technical Symposium", type: "Conference", categories: ["STEM Education"], cfpDeadline: "August" },
    { name: "ICER Conference", type: "Conference", categories: ["STEM Education"], cfpDeadline: "March" },
    { name: "ITiCSE Conference", type: "Conference", categories: ["STEM Education"], cfpDeadline: "January" },
    { name: "FIE Conference", type: "Conference", categories: ["STEM Education"], cfpDeadline: "April" },
    { name: "ASEE Annual Conference", type: "Conference", categories: ["STEM Education"], cfpDeadline: "October" },
];

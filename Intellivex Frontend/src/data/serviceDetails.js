/*
 * Service detail pages — from the six "<Service>.docx" content files.
 * Keyed by service title, and each service's sub-service pages by sub-service title
 * (both lower-case). Used for /services/{slug} and /services/{slug}/{sub}:
 *   eyebrow, title, intro (paragraphs), tags, benefits { description, items },
 *   faqs [{ question, answer }], cta { heading, text, button }.
 * Items marked "[Confirm … before publishing]" in the documents are left out
 * until they are confirmed.
 */
export const SERVICE_DETAILS = {
  "software engineering": {
    "eyebrow": "SERVICE",
    "title": "Software Engineering",
    "intro": [
      "We engineer robust, cloud-native software tailored to your business, from architecture and APIs to deployment and long-term evolution.",
      "Intellivex works as an extension of your team. We start by understanding your workflows and goals, then design, build, test and ship software in short, visible iterations, so you see progress every couple of weeks and can adjust priorities as you learn."
    ],
    "tags": [
      "Custom Software Development",
      "Software Architecture & Microservices",
      "API Development & Integration",
      "DevOps & CI/CD",
      "QA & Test Automation",
      "Legacy Modernization"
    ],
    "benefits": {
      "description": "You get software built for your processes, not a template bent to fit them. We keep code clean, tested and documented so it stays an asset as your business changes, whether our team or yours maintains it.",
      "items": [
        "Transparent, agile delivery with demos every sprint.",
        "Code and IP owned fully by you.",
        "Automated testing and deployment from the first release."
      ]
    },
    "faqs": [
      {
        "question": "How do you estimate the cost of a software project?",
        "answer": "We begin with a short discovery phase to define scope, risks and priorities. You then receive a written estimate as a fixed price for well-defined work or a time-and-materials budget for evolving products."
      },
      {
        "question": "Who owns the source code?",
        "answer": "You do. Code, designs and documentation are transferred to you under our agreement, and work lives in your repositories from the start when you prefer."
      },
      {
        "question": "How involved do we need to be?",
        "answer": "Plan for a product owner who can join a weekly check-in and sprint demos. Regular feedback is the biggest factor in building the right thing."
      },
      {
        "question": "Can you work with our in-house developers?",
        "answer": "Yes. We can lead the project, add specific skills to your team, or share delivery, following your coding standards and tools."
      },
      {
        "question": "Which technologies do you use?",
        "answer": "We commonly use .NET, Java, Node.js, Python, React and Angular on AWS, Azure or Google Cloud. We recommend a stack based on your needs and your team's ability to maintain it."
      },
      {
        "question": "Do you support software after launch?",
        "answer": "Yes. We offer support plans that cover monitoring, bug fixes, security updates and planned improvements."
      }
    ],
    "cta": {
      "heading": "Reimagine your business with Intellivex",
      "text": "Turn your ideas and processes into reliable software that grows with you. Tell us what you want to build.",
      "button": "CONTACT US"
    },
    "subs": {
      "custom software development": {
        "eyebrow": "SERVICE",
        "title": "Custom Software Development",
        "intro": [
          "Off-the-shelf tools rarely fit how your business actually runs. Intellivex builds custom software, from internal tools and customer portals to complete SaaS products, shaped around your workflows, users and growth plans.",
          "We start small with a clear first release, test it with real users, and expand from there. That approach keeps budgets under control and ensures every feature earns its place."
        ],
        "tags": [
          "Product Discovery & Scoping",
          "MVP Development",
          "SaaS Product Development",
          "Enterprise & Internal Tools",
          "Customer & Partner Portals",
          "Ongoing Feature Development"
        ],
        "benefits": {
          "description": "Custom software can remove manual work, connect scattered systems and give you capabilities competitors can't buy off the shelf. We focus on delivering that value early and building on it steadily.",
          "items": [
            "Software designed around your exact workflows.",
            "A working first release in weeks, not years.",
            "Scalable, well-documented code you fully own.",
            "No per-seat license fees for tools you build."
          ]
        },
        "faqs": [
          {
            "question": "How long does it take to build custom software?",
            "answer": "A focused MVP often takes 8 to 16 weeks. Larger platforms are delivered in phases, with usable releases along the way."
          },
          {
            "question": "Should we build custom software or buy an existing product?",
            "answer": "If a proven product covers most of your needs, buying is usually cheaper. Custom software makes sense when your process is a competitive advantage or existing tools force costly workarounds. We'll give you an honest view."
          },
          {
            "question": "What is an MVP?",
            "answer": "A minimum viable product is the smallest version that solves the core problem for real users. It lets you validate demand and gather feedback before investing in the full feature set."
          },
          {
            "question": "Can the software integrate with tools we already use?",
            "answer": "Yes. We regularly connect to CRMs, ERPs, accounting, payment and identity systems such as Salesforce, HubSpot, QuickBooks, Stripe and Microsoft 365."
          },
          {
            "question": "How do you keep our project on budget?",
            "answer": "We prioritize features with you, share progress and spend every sprint, and flag scope changes before they affect cost."
          },
          {
            "question": "Can you take over a project another team started?",
            "answer": "Yes. We begin with a code review to assess quality and risks, then recommend whether to continue, refactor or rebuild specific parts."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Get software that fits how you work, built in clear, affordable stages. Let's scope your first release.",
          "button": "CONTACT US"
        }
      },
      "software architecture & microservices": {
        "eyebrow": "SERVICE",
        "title": "Software Architecture & Microservices",
        "intro": [
          "Architecture decisions made today decide how fast you can ship next year. Intellivex designs software architectures that are easy to change, simple to operate and ready to handle growth in users, data and features.",
          "We don't push microservices on every project. Sometimes a well-structured modular application is the smarter choice. We match the design to your team size, traffic and roadmap, and document every key decision so future developers understand the why."
        ],
        "tags": [
          "Architecture Assessment",
          "Microservices Design",
          "Modular Monolith Design",
          "Event-Driven Systems",
          "Containers & Kubernetes",
          "Scalability & Performance Tuning"
        ],
        "benefits": {
          "description": "A sound architecture lets teams work independently, release more often and scale only the parts of the system that need it, without rewriting everything each time the business changes.",
          "items": [
            "Faster, safer releases with fewer side effects.",
            "Independent scaling of high-demand components.",
            "Better fault isolation when something goes wrong.",
            "Clear architecture records your team can build on."
          ]
        },
        "faqs": [
          {
            "question": "Do we need microservices?",
            "answer": "Not necessarily. Microservices help larger teams and complex systems, but they add operational overhead. For many growing products, a modular monolith is faster and cheaper. We recommend what fits your stage."
          },
          {
            "question": "Can you break up our existing monolithic application?",
            "answer": "Yes. We use gradual approaches such as the strangler pattern, carving out one service at a time while the existing system keeps running."
          },
          {
            "question": "What does an architecture assessment include?",
            "answer": "We review code structure, infrastructure, data flows, performance and security, then deliver a prioritized roadmap with quick wins and longer-term improvements."
          },
          {
            "question": "Do you work with Kubernetes?",
            "answer": "Yes. We design and run container platforms on Amazon EKS, Azure AKS and Google GKE, and also use simpler managed options when Kubernetes would be overkill."
          },
          {
            "question": "How do you handle data across multiple services?",
            "answer": "We define clear data ownership per service and use APIs and event streaming to keep systems in sync, avoiding fragile shared databases."
          },
          {
            "question": "Will our team be able to maintain the new architecture?",
            "answer": "That is a design goal from day one. We provide diagrams, decision records, runbooks and hands-on knowledge transfer."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Build on an architecture that keeps pace with your growth instead of slowing it down. Book an architecture review.",
          "button": "CONTACT US"
        }
      },
      "api development & integration": {
        "eyebrow": "SERVICE",
        "title": "API Development & Integration",
        "intro": [
          "Your business runs on many systems: CRM, ERP, payments, marketing tools and your own applications. Intellivex builds secure APIs and integrations that connect them, so data flows automatically and your team stops copying information between screens.",
          "We design APIs that are well-documented, versioned and secure by default, whether they serve your own apps, your partners or third-party developers."
        ],
        "tags": [
          "REST & GraphQL APIs",
          "Third-Party Integrations",
          "Payment Gateway Integration",
          "ERP & CRM Integration",
          "API Security & Gateways",
          "Webhooks & Event Streaming"
        ],
        "benefits": {
          "description": "Well-built integrations remove manual data entry, reduce errors and give you one accurate view of your business. Clean APIs also make it easier to launch new apps and partnerships later.",
          "items": [
            "Less manual work and fewer data-entry errors.",
            "Real-time data shared across your systems.",
            "Secure authentication, rate limiting and monitoring.",
            "Clear documentation for internal and partner developers."
          ]
        },
        "faqs": [
          {
            "question": "Which systems can you integrate?",
            "answer": "Most modern platforms with an API, including Salesforce, HubSpot, NetSuite, SAP, QuickBooks, Shopify, Stripe and Microsoft 365. We can also connect older systems through files, databases or middleware."
          },
          {
            "question": "REST or GraphQL: which should we use?",
            "answer": "REST is simple and widely supported. GraphQL suits apps that need flexible data from many sources. We choose based on your clients and use cases."
          },
          {
            "question": "How do you secure APIs?",
            "answer": "We use OAuth 2.0 or token-based authentication, encryption in transit, input validation, rate limits and logging, following OWASP API security guidance."
          },
          {
            "question": "What happens when a connected system changes its API?",
            "answer": "We build integrations with error handling, alerts and version checks, and our support plans cover updates when vendors change their APIs."
          },
          {
            "question": "Can you document our existing APIs?",
            "answer": "Yes. We produce OpenAPI specifications and developer portals so internal and partner teams can use your APIs with confidence."
          },
          {
            "question": "Do you build integrations for healthcare or finance data?",
            "answer": "Yes. We apply the extra safeguards these industries require and design with HIPAA or PCI DSS requirements in mind."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Connect your systems, automate your data flows and give your team one source of truth. Let's map your integrations.",
          "button": "CONTACT US"
        }
      },
      "devops & ci/cd": {
        "eyebrow": "SERVICE",
        "title": "DevOps & CI/CD",
        "intro": [
          "Manual deployments are slow, stressful and error-prone. Intellivex sets up DevOps practices and CI/CD pipelines that build, test and release your software automatically, so your team can ship updates with confidence.",
          "We work with the tools you already use, such as GitHub Actions, GitLab CI, Azure DevOps and Jenkins, and add infrastructure as code, monitoring and security checks so every release is repeatable and traceable."
        ],
        "tags": [
          "CI/CD Pipeline Setup",
          "Infrastructure as Code",
          "Containerization & Kubernetes",
          "Monitoring & Observability",
          "DevSecOps",
          "Release Automation"
        ],
        "benefits": {
          "description": "Strong DevOps practices shorten the time from idea to production and reduce the risk of each release. Teams spend less time firefighting and more time building features customers want.",
          "items": [
            "More frequent, lower-risk releases.",
            "Automated tests and security scans on every change.",
            "Consistent environments from development to production.",
            "Faster detection and recovery when issues occur."
          ]
        },
        "faqs": [
          {
            "question": "What is CI/CD?",
            "answer": "Continuous integration automatically builds and tests code whenever a developer makes a change. Continuous delivery automates the steps to release that code, so deployments become routine instead of risky events."
          },
          {
            "question": "How long does it take to set up a CI/CD pipeline?",
            "answer": "A pipeline for a single application can often be running within two to four weeks. Larger setups with many services are rolled out in stages."
          },
          {
            "question": "Can you improve our existing pipelines?",
            "answer": "Yes. We review your current setup, remove bottlenecks, speed up builds and add missing testing and security steps."
          },
          {
            "question": "What is DevSecOps?",
            "answer": "It means building security into the delivery pipeline, with automated code scanning, dependency checks and secrets detection, rather than treating security as a final step."
          },
          {
            "question": "Which cloud platforms do you support?",
            "answer": "AWS, Microsoft Azure and Google Cloud, as well as hybrid and on-premises environments."
          },
          {
            "question": "Will our team be able to run the pipelines?",
            "answer": "Yes. Pipelines are defined as code in your repositories, and we train your developers to maintain and extend them."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Ship updates faster and with less risk through automated, reliable delivery pipelines. Let's review your release process.",
          "button": "CONTACT US"
        }
      },
      "qa & test automation": {
        "eyebrow": "SERVICE",
        "title": "QA & Test Automation",
        "intro": [
          "Bugs found by customers cost far more than bugs found before release. Intellivex provides quality assurance and test automation that catches issues early, protects your reputation and lets your developers move faster.",
          "We combine manual exploratory testing with automated test suites for web, mobile and APIs, and plug them into your CI/CD pipeline so quality checks run on every change."
        ],
        "tags": [
          "Manual & Exploratory Testing",
          "Test Automation Frameworks",
          "API Testing",
          "Performance & Load Testing",
          "Mobile App Testing",
          "Accessibility Testing"
        ],
        "benefits": {
          "description": "A solid QA process means fewer production incidents, smoother releases and happier users. Automation takes over repetitive checks so your team can focus on new features.",
          "items": [
            "Fewer bugs reaching your customers.",
            "Faster regression testing with automated suites.",
            "Confidence that your app performs under real traffic.",
            "Clear test reports for every release."
          ]
        },
        "faqs": [
          {
            "question": "Should we automate all of our testing?",
            "answer": "No. Automation works best for repeated checks such as regression tests. Exploratory and usability testing still benefit from skilled human testers. We help you find the right balance."
          },
          {
            "question": "Which automation tools do you use?",
            "answer": "We commonly use Playwright, Cypress, Selenium, Appium and Postman, choosing tools that fit your tech stack and your team's skills."
          },
          {
            "question": "Can you test an app we built in-house?",
            "answer": "Yes. We can join your team as a dedicated QA function or audit your current testing and fill the gaps."
          },
          {
            "question": "Do you test for accessibility?",
            "answer": "Yes. We test against WCAG 2.1 and 2.2 AA guidelines, which are referenced by the ADA in the US and by the Accessibility for Ontarians with Disabilities Act (AODA) in Canada."
          },
          {
            "question": "How do you test performance?",
            "answer": "We simulate realistic user traffic with tools such as k6 or JMeter to find slow spots and breaking points before your users do."
          },
          {
            "question": "How quickly can you start?",
            "answer": "For most projects, we can begin with a test strategy and initial test cases within one to two weeks."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Release with confidence knowing your software has been thoroughly tested. Talk to our QA team.",
          "button": "CONTACT US"
        }
      },
      "legacy modernization": {
        "eyebrow": "SERVICE",
        "title": "Legacy Modernization",
        "intro": [
          "Older systems often still run critical parts of a business, but they become harder to change, secure and support every year. Intellivex modernizes legacy applications step by step, preserving the business logic that works while removing the technology that holds you back.",
          "We assess your current system, then recommend the right path: rehost, refactor, re-architect or replace. Most modernizations are delivered in phases, so your operations continue while improvements roll out."
        ],
        "tags": [
          "Legacy System Assessment",
          "Code Refactoring",
          "Platform & Framework Upgrades",
          "Database Modernization",
          "UI Modernization",
          "Monolith to Cloud-Native"
        ],
        "benefits": {
          "description": "Modernization reduces maintenance costs, closes security gaps from unsupported software and makes it easier to add new features or integrations your customers expect.",
          "items": [
            "Lower maintenance and licensing costs over time.",
            "Reduced security risk from end-of-life software.",
            "Faster development on a modern technology stack.",
            "Phased delivery that avoids risky big-bang rewrites."
          ]
        },
        "faqs": [
          {
            "question": "How do we know if our system needs modernizing?",
            "answer": "Common signs include rising maintenance costs, difficulty finding developers, slow performance, security concerns and trouble integrating with newer tools."
          },
          {
            "question": "Do we have to rewrite everything?",
            "answer": "Rarely. We often keep proven business logic and modernize around it. A full rewrite is recommended only when it is clearly the lower-risk option."
          },
          {
            "question": "Which legacy technologies do you work with?",
            "answer": "We frequently modernize older .NET Framework, Java, PHP, Visual Basic and classic ASP applications, along with legacy SQL databases."
          },
          {
            "question": "Will our business be disrupted?",
            "answer": "We plan phased releases and run old and new systems side by side where needed, so day-to-day operations continue."
          },
          {
            "question": "How long does modernization take?",
            "answer": "It depends on system size and complexity. A small application may take two to three months; larger systems are modernized over several phases."
          },
          {
            "question": "What about our existing data?",
            "answer": "We plan and test data migration carefully, validating records before and after each move to protect accuracy and history."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Give your critical systems a modern foundation without disrupting the business that depends on them. Start with an assessment.",
          "button": "CONTACT US"
        }
      }
    }
  },
  "mobile development": {
    "eyebrow": "SERVICE",
    "title": "Mobile Development",
    "intro": [
      "We create high-performance, user-first mobile apps for iOS and Android that engage users, drive retention and grow revenue.",
      "From the first wireframe to App Store and Google Play launch, Intellivex handles strategy, design, development, testing and ongoing updates. We help you choose between native and cross-platform development based on your budget, timeline and the experience your users expect."
    ],
    "tags": [
      "Native iOS Development",
      "Native Android Development",
      "Cross-Platform Apps (Flutter & React Native)",
      "Mobile UI/UX Design",
      "App Maintenance & Support",
      "App Store Optimization (ASO)"
    ],
    "benefits": {
      "description": "A great app earns a place on your customers' home screens. We focus on speed, usability and reliability, then use real analytics to keep improving after launch.",
      "items": [
        "Intuitive designs that follow Apple and Google guidelines.",
        "Fast, stable apps tested on a wide range of real devices.",
        "Smooth App Store and Google Play submission support.",
        "Analytics in place to track engagement and retention."
      ]
    },
    "faqs": [
      {
        "question": "How much does it cost to build a mobile app?",
        "answer": "Cost depends on features, platforms and integrations. A focused MVP costs much less than a full-featured product. After a short discovery phase, we provide a clear estimate."
      },
      {
        "question": "Native or cross-platform: which is better?",
        "answer": "Native apps offer the best performance and device access. Cross-platform apps share most code between iOS and Android, often reducing cost and time. We recommend based on your needs."
      },
      {
        "question": "How long does it take to launch an app?",
        "answer": "Many MVPs launch in three to five months, including design, development, testing and store review."
      },
      {
        "question": "Will you publish the app to the stores?",
        "answer": "Yes. We prepare listings, handle the submission process and address any review feedback from Apple or Google."
      },
      {
        "question": "Can the app work with our existing systems?",
        "answer": "Yes. We connect apps to your backend, CRM, payment provider or other systems through secure APIs."
      },
      {
        "question": "Do you support apps after launch?",
        "answer": "Yes. We offer maintenance plans that cover OS updates, bug fixes, performance monitoring and new features."
      }
    ],
    "cta": {
      "heading": "Reimagine your business with Intellivex",
      "text": "Put your business in your customers' pockets with an app they'll want to keep using. Let's plan your app.",
      "button": "CONTACT US"
    },
    "subs": {
      "native ios development": {
        "eyebrow": "SERVICE",
        "title": "Native iOS Development",
        "intro": [
          "iPhone users expect apps that feel fast, polished and familiar. Intellivex builds native iOS apps with Swift and SwiftUI that take full advantage of Apple's hardware, design language and latest features.",
          "We develop for iPhone and iPad, and can extend your app to Apple Watch where it adds real value. Every app is built to meet App Store Review Guidelines and Apple's privacy requirements from the start."
        ],
        "tags": [
          "Swift & SwiftUI Development",
          "iPhone & iPad Apps",
          "Apple Watch Apps",
          "Apple Pay & In-App Purchases",
          "HealthKit & Device Integrations",
          "App Store Submission"
        ],
        "benefits": {
          "description": "Native development gives you the smoothest performance and earliest access to new iOS features, which matters when your audience includes a large share of iPhone users, as it does in the US and Canada.",
          "items": [
            "Smooth, responsive performance on Apple devices.",
            "Full access to Face ID, camera, sensors and Apple Pay.",
            "Design that follows Apple's Human Interface Guidelines.",
            "Built-in privacy and security best practices."
          ]
        },
        "faqs": [
          {
            "question": "Why choose native iOS over cross-platform?",
            "answer": "Native is a strong choice when performance, advanced device features or a premium Apple experience are priorities, or when your users are mostly on iPhone."
          },
          {
            "question": "Which iOS versions will the app support?",
            "answer": "We usually support the current and previous major iOS versions, which covers the large majority of active devices. We confirm the right range for your audience."
          },
          {
            "question": "Can you add in-app purchases or subscriptions?",
            "answer": "Yes. We implement StoreKit for purchases and subscriptions, following Apple's rules for digital goods."
          },
          {
            "question": "How long does App Store review take?",
            "answer": "Most reviews are completed within a few days. We prepare submissions carefully to reduce the chance of rejection."
          },
          {
            "question": "Can you update an existing iOS app?",
            "answer": "Yes. We can take over your codebase, fix issues, update it for new iOS releases and add features."
          },
          {
            "question": "Do you build apps for regulated industries?",
            "answer": "Yes. For healthcare, finance and similar fields, we apply stricter security and data-handling controls in line with requirements such as HIPAA."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Deliver a polished, high-performance experience to iPhone and iPad users. Talk to our iOS team.",
          "button": "CONTACT US"
        }
      },
      "native android development": {
        "eyebrow": "SERVICE",
        "title": "Native Android Development",
        "intro": [
          "Android runs on thousands of devices, from budget phones to flagship tablets. Intellivex builds native Android apps with Kotlin and Jetpack Compose that perform reliably across this wide range of screens and hardware.",
          "We follow Google's Material Design and Play Store policies, test on real devices, and optimize for battery, memory and network conditions so your app works well for every user."
        ],
        "tags": [
          "Kotlin & Jetpack Compose",
          "Phone & Tablet Apps",
          "Wear OS Apps",
          "Google Pay & Play Billing",
          "Device & Hardware Integrations",
          "Google Play Publishing"
        ],
        "benefits": {
          "description": "Native Android development delivers the best performance and deepest device integration, helping you reach a broad audience with an app that feels at home on their device.",
          "items": [
            "Reliable performance across many devices and screen sizes.",
            "Full access to Android features and hardware.",
            "Modern, maintainable code using Google's recommended tools.",
            "Play Store compliance and smooth publishing."
          ]
        },
        "faqs": [
          {
            "question": "How do you handle so many Android devices?",
            "answer": "We use responsive layouts and test on a mix of real devices and cloud device labs covering popular brands, screen sizes and Android versions."
          },
          {
            "question": "Which Android versions do you support?",
            "answer": "We typically target versions that cover the vast majority of active devices and meet Google Play's current target API requirements."
          },
          {
            "question": "Can you build for enterprise or rugged devices?",
            "answer": "Yes. We build apps for field teams, warehouses and logistics, including barcode scanning, offline mode and device management."
          },
          {
            "question": "Do you use Kotlin or Java?",
            "answer": "Kotlin is our default for new apps, as recommended by Google. We also maintain and migrate existing Java apps."
          },
          {
            "question": "How long does Google Play review take?",
            "answer": "Reviews often take from a few hours to a few days, though new developer accounts may take longer. We handle the submission process for you."
          },
          {
            "question": "Can you optimize an existing Android app?",
            "answer": "Yes. We address crashes, slow screens and battery drain, and update apps for the latest Android releases."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Reach Android users with a fast, reliable app built for every screen. Let's talk about your project.",
          "button": "CONTACT US"
        }
      },
      "cross-platform apps (flutter & react native)": {
        "eyebrow": "SERVICE",
        "title": "Cross-Platform Apps",
        "intro": [
          "Want to reach both iPhone and Android users without building two separate apps? Intellivex develops cross-platform apps with Flutter and React Native, sharing most of the code between platforms while keeping a native look and feel.",
          "This approach is often a smart fit for startups and growing businesses that need to launch quickly, test ideas and keep long-term maintenance manageable."
        ],
        "tags": [
          "Flutter Development",
          "React Native Development",
          "Shared Codebase Strategy",
          "Native Module Integration",
          "Cross-Platform MVPs",
          "Migration from Native Apps"
        ],
        "benefits": {
          "description": "One shared codebase means features reach both platforms together, updates are simpler and your development budget goes further, without a noticeable trade-off for most business apps.",
          "items": [
            "One codebase for iOS and Android.",
            "Faster time to market for new apps and features.",
            "Lower development and maintenance costs.",
            "Native features available when you need them."
          ]
        },
        "faqs": [
          {
            "question": "Flutter or React Native: which should we choose?",
            "answer": "Both are mature and widely used. Flutter offers highly consistent UI across platforms; React Native suits teams with JavaScript or React experience. We recommend based on your app and team."
          },
          {
            "question": "Will a cross-platform app feel native?",
            "answer": "For most business, retail and service apps, users won't notice a difference. We use platform-specific components and patterns where they matter."
          },
          {
            "question": "How much can we save compared to two native apps?",
            "answer": "Savings vary, but sharing most of the code typically reduces build and maintenance effort compared with two separate native apps."
          },
          {
            "question": "When is cross-platform not the right choice?",
            "answer": "Apps that depend heavily on advanced graphics, complex background processing or the very latest device features may be better built natively."
          },
          {
            "question": "Can we add native code later if needed?",
            "answer": "Yes. Both frameworks allow native modules for features that need direct platform access."
          },
          {
            "question": "Can you also build a web version?",
            "answer": "Often, yes. Flutter and React Native can share parts of the code with a web app, depending on your requirements."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Launch on iOS and Android together with one efficient codebase. Let's find the right framework for you.",
          "button": "CONTACT US"
        }
      },
      "mobile ui/ux design": {
        "eyebrow": "SERVICE",
        "title": "Mobile UI/UX Design",
        "intro": [
          "Users decide within moments whether an app is worth keeping. Intellivex designs mobile experiences that are clear, attractive and easy to use, so people can complete tasks quickly and come back again.",
          "We start with user research and journey mapping, then move through wireframes, interactive prototypes and polished visual design, testing with real users along the way."
        ],
        "tags": [
          "User Research & Personas",
          "Wireframing & Prototyping",
          "Visual & Interaction Design",
          "Design Systems",
          "Usability Testing",
          "Accessibility Design"
        ],
        "benefits": {
          "description": "Good design reduces drop-offs, support requests and development rework. Validating ideas through prototypes before coding saves time and money.",
          "items": [
            "Designs grounded in real user research.",
            "Clickable prototypes to test ideas before development.",
            "Consistent design systems that speed up future work.",
            "Accessible experiences for a wider audience."
          ]
        },
        "faqs": [
          {
            "question": "What is the difference between UI and UX?",
            "answer": "UX (user experience) covers how the app works and how easy it is to use. UI (user interface) covers how it looks: layout, colors, typography and visual details."
          },
          {
            "question": "What tools do you use?",
            "answer": "We primarily design in Figma, which makes collaboration and developer handoff simple."
          },
          {
            "question": "Can you redesign our existing app?",
            "answer": "Yes. We review analytics and user feedback, identify friction points, and redesign the areas that will have the most impact."
          },
          {
            "question": "How do you test designs?",
            "answer": "We run usability sessions with interactive prototypes, observing real users as they complete key tasks, then refine the design."
          },
          {
            "question": "Do you design for accessibility?",
            "answer": "Yes. We follow WCAG guidelines for color contrast, text size, screen readers and touch targets."
          },
          {
            "question": "Can your designs be built by our own developers?",
            "answer": "Yes. We provide detailed specs, assets and a design system to make handoff smooth for any development team."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Give your users an app experience that feels effortless from the first tap. Let's design it together.",
          "button": "CONTACT US"
        }
      },
      "app maintenance & support": {
        "eyebrow": "SERVICE",
        "title": "App Maintenance & Support",
        "intro": [
          "Launching an app is the beginning, not the end. Apple and Google release major OS updates every year, devices change and user expectations grow. Intellivex keeps your app secure, stable and up to date so it continues to perform.",
          "Our support plans cover monitoring, bug fixes, OS compatibility updates, security patches and a steady pipeline of improvements, with clear response times you can rely on."
        ],
        "tags": [
          "Bug Fixes & Crash Monitoring",
          "OS & Device Compatibility Updates",
          "Security Patching",
          "Performance Optimization",
          "Feature Enhancements",
          "Backend & API Support"
        ],
        "benefits": {
          "description": "Regular maintenance protects your ratings, your users' data and your investment, and avoids the expensive emergency fixes that come from neglected apps.",
          "items": [
            "Proactive crash and performance monitoring.",
            "Timely updates for new iOS and Android releases.",
            "Defined response times for critical issues.",
            "Monthly reports on app health and improvements."
          ]
        },
        "faqs": [
          {
            "question": "What does an app maintenance plan include?",
            "answer": "Typically monitoring, bug fixes, OS updates, dependency and security updates, store compliance changes and a set number of hours for enhancements."
          },
          {
            "question": "Can you support an app built by another company?",
            "answer": "Yes. We start with a code and infrastructure review, then take over support with a clear plan."
          },
          {
            "question": "How fast do you respond to critical issues?",
            "answer": "Response times depend on your plan, with faster response for critical issues such as outages or crashes affecting many users."
          },
          {
            "question": "Why does our app need updates if nothing is broken?",
            "answer": "New OS versions, store policy changes and security vulnerabilities can break or expose apps over time. Regular updates prevent problems before users notice them."
          },
          {
            "question": "How do you monitor app health?",
            "answer": "We use tools such as Firebase Crashlytics and analytics platforms to track crashes, performance and user behavior."
          },
          {
            "question": "Can we change our support level later?",
            "answer": "Yes. Plans can be adjusted as your app and user base grow."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Keep your app fast, secure and five-star ready with dependable ongoing support. Let's talk about a plan.",
          "button": "CONTACT US"
        }
      },
      "app store optimization (aso)": {
        "eyebrow": "SERVICE",
        "title": "App Store Optimization",
        "intro": [
          "A great app still needs to be found. Intellivex helps your app stand out in the Apple App Store and Google Play with optimized listings, keywords and visuals that turn more store visitors into installs.",
          "We research how your audience searches, study competing apps, then test and refine titles, descriptions, screenshots and preview videos based on real performance data."
        ],
        "tags": [
          "Keyword Research",
          "Listing Copywriting",
          "Screenshot & Video Design",
          "A/B Testing",
          "Ratings & Review Strategy",
          "Localization (English & French)"
        ],
        "benefits": {
          "description": "ASO helps you grow organic downloads without relying entirely on paid ads. Even small gains in conversion rate can add up to meaningful growth over time.",
          "items": [
            "Better visibility for relevant search terms.",
            "Higher conversion from store visits to installs.",
            "Data-driven testing of listing creatives.",
            "Listings localized for US and Canadian audiences."
          ]
        },
        "faqs": [
          {
            "question": "What is App Store Optimization?",
            "answer": "ASO is the process of improving your app's store listing so it ranks better in search and convinces more visitors to install it."
          },
          {
            "question": "How long does it take to see results?",
            "answer": "Some changes show impact within a few weeks; keyword rankings usually build over two to three months of ongoing optimization."
          },
          {
            "question": "Can you guarantee a top ranking?",
            "answer": "No one can honestly guarantee rankings, as Apple and Google control their algorithms. We focus on measurable improvements in visibility and conversion."
          },
          {
            "question": "Do you handle French listings for Canada?",
            "answer": "Yes. We can localize listings for French-speaking users, including Quebec, alongside English."
          },
          {
            "question": "How do ratings and reviews affect ASO?",
            "answer": "Ratings strongly influence both ranking and conversions. We help you encourage reviews at the right moments and respond to feedback."
          },
          {
            "question": "Does ASO replace paid user acquisition?",
            "answer": "Not entirely, but it makes paid campaigns more effective, since better listings convert more of the traffic you pay for."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Help the right users find and install your app. Start with a free ASO review.",
          "button": "CONTACT US"
        }
      }
    }
  },
  "cloud & cybersecurity": {
    "eyebrow": "SERVICE",
    "title": "Cloud & Cybersecurity",
    "intro": [
      "We architect secure, resilient cloud environments that protect your data, optimize costs and scale on demand.",
      "Intellivex works across AWS, Microsoft Azure and Google Cloud, so our advice follows your needs rather than a vendor's sales target. From a first migration to a security audit or ongoing cost management, we bring clear plans, realistic timelines and documentation your team can own."
    ],
    "tags": [
      "Cloud Migration & Modernization",
      "AWS, Azure & Google Cloud",
      "Cloud Architecture",
      "Cybersecurity Assessments & Audits",
      "Data Protection & Compliance",
      "Managed Cloud & FinOps"
    ],
    "benefits": {
      "description": "We focus on the outcomes IT leaders and business owners care about: predictable costs, fewer surprises during change, and a security posture you can explain to customers, auditors and insurers.",
      "items": [
        "Vendor-neutral guidance across the three major cloud platforms.",
        "Security and compliance built into every project from day one.",
        "Phased plans that keep your business running during change.",
        "Ongoing visibility into cloud spend and security health."
      ]
    },
    "faqs": [
      {
        "question": "Which cloud platform is right for my business?",
        "answer": "It depends on your existing tools, team skills, budget and compliance needs. Companies already on Microsoft 365 often lean toward Azure, while others choose AWS or Google Cloud for specific services or pricing. We compare options against your requirements."
      },
      {
        "question": "Do you work with small and mid-sized businesses?",
        "answer": "Yes. We scope projects so you pay for what you need now, with a clear path to grow later."
      },
      {
        "question": "Can you help if we are already in the cloud?",
        "answer": "Yes. Many engagements start with a review of an existing environment to find security gaps, unused resources and ways to reduce monthly spend."
      },
      {
        "question": "Can you keep our data in Canada or the US?",
        "answer": "Yes. All three major providers operate data centers in both countries. We configure your environment to keep data in the regions your contracts, customers or regulations require."
      },
      {
        "question": "Will you help us meet compliance requirements?",
        "answer": "We help you align with frameworks such as SOC 2, HIPAA, PCI DSS and PIPEDA, and prepare the evidence auditors ask for. Formal certification is issued by an independent auditor."
      },
      {
        "question": "How do we get started?",
        "answer": "Book a free discovery call. We'll learn about your goals and current setup, then send a short written proposal with scope, timeline and cost."
      }
    ],
    "cta": {
      "heading": "Reimagine your business with Intellivex",
      "text": "Build a cloud foundation that is secure, cost-aware and ready to grow with you. Let's talk about where you are today.",
      "button": "CONTACT US"
    },
    "subs": {
      "cloud migration & modernization": {
        "eyebrow": "SERVICE",
        "title": "Cloud Migration & Modernization",
        "intro": [
          "Aging servers, rising license costs and end-of-support software slow teams down. Intellivex moves your applications, data and workloads to the cloud with a step-by-step plan built around your business hours, not ours.",
          "We start by assessing what you run today, then decide what to move as-is, what to improve along the way and what to retire. Where it pays off, we modernize applications with containers, managed databases and serverless services so they are easier and cheaper to maintain."
        ],
        "tags": [
          "Cloud Readiness Assessment",
          "Lift-and-Shift Migration",
          "Application Modernization",
          "Database Migration",
          "Data Center Exit",
          "Post-Migration Optimization"
        ],
        "benefits": {
          "description": "A good migration is one your customers never notice. We plan carefully, test before every cutover and stay with you after go-live to tune performance and cost.",
          "items": [
            "Minimal downtime through phased, tested cutovers.",
            "Lower infrastructure and maintenance overhead over time.",
            "Modern, scalable applications that are easier to update.",
            "A documented rollback plan for every migration wave."
          ]
        },
        "faqs": [
          {
            "question": "How long does a cloud migration take?",
            "answer": "A small environment can move in a few weeks. Larger, multi-application estates usually move in waves over several months. You get a realistic timeline after our assessment."
          },
          {
            "question": "Will our business experience downtime?",
            "answer": "We plan cutovers for low-traffic windows such as evenings or weekends and test each step beforehand. Most clients see little or no disruption."
          },
          {
            "question": "Do we need to rebuild our applications?",
            "answer": "Not always. Many workloads move as-is. We recommend modernization only where it brings a clear benefit, such as lower costs or easier maintenance."
          },
          {
            "question": "Will moving to the cloud reduce our IT costs?",
            "answer": "Often, but not automatically. Savings come from right-sizing, retiring unused systems and using the right pricing models. We estimate costs before migration and review spend afterward."
          },
          {
            "question": "How do you protect our data during migration?",
            "answer": "Data is encrypted in transit and at rest, access is limited to named team members, and we validate data integrity after every transfer."
          },
          {
            "question": "What happens after the migration is complete?",
            "answer": "We provide documentation, knowledge transfer and a post-migration review. Ongoing managed support is available if you want it."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Leave aging infrastructure behind with a migration plan built around your business. Start with a free readiness assessment.",
          "button": "CONTACT US"
        }
      },
      "aws, azure & google cloud": {
        "eyebrow": "SERVICE",
        "title": "AWS, Azure & Google Cloud",
        "intro": [
          "Every cloud platform has its strengths. Intellivex helps you choose, set up and run the right one, or the right combination, for your workloads, team and budget.",
          "Our engineers work hands-on with Amazon Web Services, Microsoft Azure and Google Cloud. We handle account structure, networking, identity, logging and guardrails, so your environment is secure and well-organized from day one instead of cleaned up later."
        ],
        "tags": [
          "Amazon Web Services (AWS)",
          "Microsoft Azure",
          "Google Cloud Platform",
          "Multi-Cloud & Hybrid Setup",
          "Landing Zone & Account Setup",
          "Identity & Network Configuration"
        ],
        "benefits": {
          "description": "You get practical, platform-specific expertise without being locked into one provider's way of doing things. We put guardrails in place early, so growth doesn't bring runaway bills or security blind spots.",
          "items": [
            "Unbiased platform recommendations based on your needs.",
            "Secure landing zones with identity, logging and alerts in place.",
            "Best-practice setups for each provider's native services.",
            "Support for single-cloud, multi-cloud and hybrid setups."
          ]
        },
        "faqs": [
          {
            "question": "Should we use one cloud provider or several?",
            "answer": "Most businesses do well with one primary provider, which keeps management simpler. Multi-cloud makes sense for specific needs, such as a particular service or a customer requirement. We help you weigh the trade-offs."
          },
          {
            "question": "We use Microsoft 365. Does that mean we must use Azure?",
            "answer": "No, but Azure integrates closely with Microsoft 365 and Entra ID, which can simplify identity management. We look at your full picture first."
          },
          {
            "question": "Can you connect the cloud to our on-premises systems?",
            "answer": "Yes. We design secure hybrid connections using VPNs or dedicated links, so cloud and on-site systems work together."
          },
          {
            "question": "Can you take over an environment another vendor built?",
            "answer": "Yes. We review what's in place, document it, fix urgent issues and agree on a plan going forward."
          },
          {
            "question": "Can you run the environment for us after setup?",
            "answer": "Yes. Our Managed Cloud & FinOps service covers monitoring, patching, backups and monthly cost reviews."
          },
          {
            "question": "Do your engineers hold cloud certifications?",
            "answer": "Our engineers hold certifications across AWS, Azure and Google Cloud [confirm and list the team's current certifications before publishing], and we keep skills current as platforms evolve."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Get the most out of AWS, Azure or Google Cloud with a team that works across all three. Let's find the right fit for you.",
          "button": "CONTACT US"
        }
      },
      "cloud architecture": {
        "eyebrow": "SERVICE",
        "title": "Cloud Architecture",
        "intro": [
          "The decisions you make early in the cloud shape your costs, security and reliability for years. Intellivex designs cloud architectures that are simple to run, ready to scale and matched to how your business actually works.",
          "We follow the well-architected frameworks published by AWS, Azure and Google Cloud, covering security, reliability, performance, cost and operations. Every design comes with diagrams, decision notes and infrastructure as code, so your environment is repeatable and easy to hand over."
        ],
        "tags": [
          "Solution Architecture Design",
          "Landing Zone Design",
          "Infrastructure as Code",
          "High Availability & Disaster Recovery",
          "Serverless & Container Platforms",
          "Architecture Reviews"
        ],
        "benefits": {
          "description": "Good architecture prevents expensive rework. We design for the load you have today with room for the growth you expect, avoiding both fragile shortcuts and over-engineered systems you don't need.",
          "items": [
            "Designs aligned with provider well-architected best practices.",
            "Built-in redundancy and backups to reduce the impact of outages.",
            "Infrastructure as code for consistent, repeatable deployments.",
            "Clear diagrams and documentation your team can maintain."
          ]
        },
        "faqs": [
          {
            "question": "What is a cloud architecture review?",
            "answer": "A structured assessment of your environment against security, reliability, performance and cost best practices. You receive a prioritized list of findings and practical recommendations."
          },
          {
            "question": "What is infrastructure as code, and why does it matter?",
            "answer": "Your cloud setup is defined in version-controlled files using tools like Terraform rather than built by hand. It reduces errors, makes changes traceable and lets you rebuild environments quickly."
          },
          {
            "question": "How do you plan for outages and disasters?",
            "answer": "We agree on how long you can afford to be down and how much data you can afford to lose, then design backup, failover and recovery steps to meet those targets, and help you test them."
          },
          {
            "question": "Can your designs scale as we grow?",
            "answer": "Yes. We use auto-scaling, managed services and modular designs so capacity grows with demand without paying for idle resources."
          },
          {
            "question": "Do you only design, or do you also build?",
            "answer": "Both. We can deliver the design for your team to build, build it ourselves, or work alongside your engineers."
          },
          {
            "question": "What do we receive at the end of a project?",
            "answer": "Architecture diagrams, a summary of key design decisions, infrastructure code in your repository and runbooks for common operational tasks."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Build on a cloud foundation designed to stay secure, reliable and cost-effective as you grow. Talk to our architects today.",
          "button": "CONTACT US"
        }
      },
      "cybersecurity assessments & audits": {
        "eyebrow": "SERVICE",
        "title": "Cybersecurity Assessments & Audits",
        "intro": [
          "You can't fix what you can't see. Intellivex assesses your applications, cloud environments and internal systems to uncover vulnerabilities and misconfigurations before attackers do.",
          "Our assessments combine automated scanning with hands-on testing by experienced security engineers. You receive a clear report that ranks every finding by risk and explains how to fix it in plain language, not just a list of technical alerts."
        ],
        "tags": [
          "Vulnerability Assessments",
          "Penetration Testing",
          "Cloud Security Posture Reviews",
          "Web & Mobile App Security Testing",
          "Security Audits & Gap Analysis",
          "Remediation Support"
        ],
        "benefits": {
          "description": "Regular assessments give you an honest picture of your security posture and a prioritized plan to improve it. They also provide evidence that customers, insurers and auditors increasingly ask for.",
          "items": [
            "Real vulnerabilities found and ranked by business risk.",
            "Clear, actionable reports for technical and executive readers.",
            "Evidence to support SOC 2, PCI DSS and cyber insurance requirements.",
            "Retesting to confirm that fixes work."
          ]
        },
        "faqs": [
          {
            "question": "What is the difference between a vulnerability assessment and a penetration test?",
            "answer": "A vulnerability assessment identifies known weaknesses, largely through scanning. A penetration test goes further: our engineers safely attempt to exploit weaknesses to show the real-world impact."
          },
          {
            "question": "How often should we be tested?",
            "answer": "At least once a year, and after major changes such as a new application or cloud migration. Some frameworks, such as PCI DSS, set specific testing requirements."
          },
          {
            "question": "Will testing disrupt our systems?",
            "answer": "We agree on scope, timing and rules of engagement in advance and test carefully to avoid disruption. Sensitive tests can be scheduled outside business hours."
          },
          {
            "question": "What standards do you follow?",
            "answer": "Our methods draw on recognized frameworks such as the NIST Cybersecurity Framework, OWASP testing guides and CIS Benchmarks."
          },
          {
            "question": "What do we receive at the end?",
            "answer": "An executive summary, a detailed technical report with risk ratings and fix steps, and a debrief call with our team."
          },
          {
            "question": "Can you help us fix what you find?",
            "answer": "Yes. We can guide your team through remediation or handle fixes directly, then retest to confirm issues are resolved."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Find and fix your security gaps before someone else finds them. Schedule a security assessment.",
          "button": "CONTACT US"
        }
      },
      "data protection & compliance": {
        "eyebrow": "SERVICE",
        "title": "Data Protection & Compliance",
        "intro": [
          "Customers, partners and regulators expect you to handle data responsibly. Intellivex helps you protect sensitive information and meet the security and privacy requirements that apply to your business in the US and Canada.",
          "We combine practical controls, such as encryption, access management, backups and monitoring, with the policies and evidence auditors look for. Whether you are preparing for a SOC 2 audit, handling health data under HIPAA or responding to Canadian privacy laws like PIPEDA and Quebec's Law 25, we help you build a program you can keep up with."
        ],
        "tags": [
          "Identity & Access Management",
          "Backup & Disaster Recovery",
          "Encryption & Key Management",
          "Compliance Readiness (SOC 2, HIPAA, PCI DSS)",
          "Privacy Program Support (PIPEDA, Law 25, CCPA)",
          "Policies & Security Awareness"
        ],
        "benefits": {
          "description": "Compliance should support your business, not stall it. We focus first on the controls that reduce real risk, then help you document and maintain them so audits and customer security questionnaires become routine.",
          "items": [
            "Lower risk of data loss, breaches and costly downtime.",
            "Audit-ready policies, controls and evidence in one place.",
            "Faster answers to customer security questionnaires.",
            "Controls mapped to the frameworks your industry requires."
          ]
        },
        "faqs": [
          {
            "question": "Which compliance frameworks do you support?",
            "answer": "We commonly work with SOC 2, HIPAA, PCI DSS, ISO 27001, PIPEDA, Quebec's Law 25 and US state privacy laws such as the CCPA. We help you identify which apply to you."
          },
          {
            "question": "Can you certify us as compliant?",
            "answer": "No company can self-certify you. We prepare your environment, policies and evidence, then work alongside the independent auditor or assessor who issues the report or certification."
          },
          {
            "question": "How long does it take to become SOC 2 ready?",
            "answer": "It varies with your starting point. Many growing companies reach readiness for a SOC 2 Type I audit in roughly three to six months. A Type II report also requires an observation period, often three to twelve months."
          },
          {
            "question": "How do you protect against ransomware?",
            "answer": "We use layered defenses: multi-factor authentication, least-privilege access, patching, monitoring and immutable, tested backups. No tool prevents every attack, but these controls greatly reduce the impact and speed up recovery."
          },
          {
            "question": "Does our data stay in our country?",
            "answer": "It can. We configure storage and backups in the US or Canadian regions you choose and document where data lives for your contracts and privacy notices."
          },
          {
            "question": "Do you offer ongoing compliance support?",
            "answer": "Yes. We run quarterly access reviews, backup restore tests, policy updates and evidence collection, so you stay ready between audits."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Protect your data and earn your customers' trust with security that holds up to scrutiny. Start with a compliance readiness review.",
          "button": "CONTACT US"
        }
      },
      "managed cloud & finops": {
        "eyebrow": "SERVICE",
        "title": "Managed Cloud & FinOps",
        "intro": [
          "Running a cloud environment well takes constant attention: patching, monitoring, backups and keeping an eye on a bill that can grow quietly every month. Intellivex manages your cloud day to day so your team can focus on your products and customers.",
          "Our FinOps practice brings finance and engineering together around clear cost data. We tag resources, set budgets, right-size workloads and review spending with you every month, so cloud costs stay predictable and tied to business value."
        ],
        "tags": [
          "24/7 Monitoring & Alerting",
          "Patching & Backup Management",
          "Incident Response Support",
          "Cloud Cost Optimization",
          "Budgeting & Cost Reporting",
          "Reserved & Savings Plan Management"
        ],
        "benefits": {
          "description": "You get a dependable operations team without hiring one, plus the cost visibility to make confident decisions about your cloud spend.",
          "items": [
            "Proactive monitoring that catches issues early.",
            "Clear monthly reports on performance, security and spend.",
            "Identified savings from idle and oversized resources.",
            "Defined response times backed by a service agreement."
          ]
        },
        "faqs": [
          {
            "question": "What is FinOps?",
            "answer": "FinOps is a practice for managing cloud costs that brings engineering, finance and business teams together. The goal is not just spending less but spending wisely, with clear accountability for every dollar."
          },
          {
            "question": "How much can we save on our cloud bill?",
            "answer": "It depends on your current setup. Environments that haven't been reviewed recently often have idle resources and oversized servers. We share a savings estimate after an initial cost review, before you commit."
          },
          {
            "question": "What does managed cloud include?",
            "answer": "Monitoring, alerting, patching, backup checks, security updates, incident support and regular reviews, with scope defined in your service agreement."
          },
          {
            "question": "Do you offer 24/7 support?",
            "answer": "Yes. 24/7 monitoring and critical incident response are available, with response times set by your plan."
          },
          {
            "question": "Will we lose control of our environment?",
            "answer": "No. You keep ownership of your accounts and data. We work through role-based access you control and can revoke at any time."
          },
          {
            "question": "Can you manage multiple clouds?",
            "answer": "Yes. We manage AWS, Azure and Google Cloud environments, including combined cost reporting across providers."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Keep your cloud running smoothly and your costs under control. Start with a free cloud cost review.",
          "button": "CONTACT US"
        }
      }
    }
  },
  "ai & data innovation": {
    "eyebrow": "SERVICE",
    "title": "AI & Data Innovation",
    "intro": [
      "We turn your data into a competitive advantage with AI that automates work, predicts what's next and unlocks new growth.",
      "Intellivex helps you move from AI curiosity to measurable results. We start with the business problem, check that your data can support it, and deliver focused solutions, from AI assistants and agents to forecasting models and dashboards, with security, privacy and human oversight built in."
    ],
    "tags": [
      "Generative AI Consulting",
      "Agentic AI & AI Agents",
      "Custom AI & LLM Development",
      "Machine Learning & Predictive Analytics",
      "Data Science & Business Intelligence",
      "Intelligent Automation",
      "AI Readiness Workshops"
    ],
    "benefits": {
      "description": "We focus on practical AI that saves time, improves decisions and fits into how your team already works, starting with small pilots that prove value before you scale.",
      "items": [
        "Use cases prioritized by business value and feasibility.",
        "Pilots that demonstrate results in weeks, not years.",
        "Responsible AI with privacy, security and human review.",
        "Solutions that integrate with your existing tools and data."
      ]
    },
    "faqs": [
      {
        "question": "Where should we start with AI?",
        "answer": "Most companies begin with an AI Readiness Workshop to identify high-value use cases, then run a small pilot on one of them before expanding."
      },
      {
        "question": "Do we need a lot of data to use AI?",
        "answer": "Not always. Generative AI can work with your existing documents and knowledge. Predictive models usually need historical data, and we assess whether yours is sufficient."
      },
      {
        "question": "Is our data safe when using AI tools?",
        "answer": "We use enterprise AI services with data-protection commitments, control access to sensitive information and can deploy within your own cloud environment."
      },
      {
        "question": "Will AI replace our employees?",
        "answer": "Our focus is on removing repetitive tasks so your people can spend more time on work that needs human judgment, relationships and creativity."
      },
      {
        "question": "How do you measure success?",
        "answer": "We agree on clear metrics up front, such as hours saved, response time, accuracy or revenue impact, and track them through the pilot and beyond."
      },
      {
        "question": "Which AI platforms do you work with?",
        "answer": "We work with leading models and platforms, including OpenAI, Anthropic Claude, Google Gemini, Azure AI, Amazon Bedrock and open-source models, choosing what best fits your needs."
      }
    ],
    "cta": {
      "heading": "Reimagine your business with Intellivex",
      "text": "Turn your data and ideas into practical AI that delivers measurable results. Let's find your best first use case.",
      "button": "CONTACT US"
    },
    "subs": {
      "generative ai consulting": {
        "eyebrow": "SERVICE",
        "title": "Generative AI Consulting",
        "intro": [
          "Generative AI can draft content, answer questions, summarize documents and support customers, but only if it is applied to the right problems in the right way. Intellivex helps you separate real opportunities from hype and build a clear plan for adoption.",
          "We assess your processes, data and risk tolerance, recommend tools and use cases, and set up the policies and guardrails your organization needs to use generative AI safely."
        ],
        "tags": [
          "GenAI Strategy & Roadmap",
          "Use Case Discovery",
          "Tool & Model Selection",
          "Proof of Concept Development",
          "AI Governance & Policy",
          "Change Management & Training"
        ],
        "benefits": {
          "description": "A clear strategy prevents wasted spending on tools that don't fit and helps your team adopt AI with confidence. We give you a realistic roadmap tied to measurable business outcomes.",
          "items": [
            "Vendor-neutral advice on models and tools.",
            "A prioritized roadmap based on value and effort.",
            "Responsible use policies and risk controls.",
            "Training that helps employees use AI effectively."
          ]
        },
        "faqs": [
          {
            "question": "What can generative AI do for our business?",
            "answer": "Common uses include drafting emails and reports, summarizing documents, answering internal knowledge questions, supporting customer service and speeding up software development."
          },
          {
            "question": "Should we use ChatGPT, Copilot, Claude or Gemini?",
            "answer": "Each has strengths. The right choice depends on your existing software, security needs, budget and use cases. We help you compare options objectively."
          },
          {
            "question": "What are the risks of generative AI?",
            "answer": "Key risks include inaccurate answers, data leakage, bias and copyright concerns. We address them with governance, human review and secure configurations."
          },
          {
            "question": "How long does a proof of concept take?",
            "answer": "Many proofs of concept can be built and tested within four to eight weeks."
          },
          {
            "question": "Do you help create an AI usage policy?",
            "answer": "Yes. We help you draft practical policies covering approved tools, data handling, review requirements and accountability."
          },
          {
            "question": "What does a consulting engagement cost?",
            "answer": "We offer fixed-scope engagements for strategy and proof of concept work, so you know the cost up front."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Cut through the hype and build a generative AI plan that delivers real value. Talk to our AI consultants.",
          "button": "CONTACT US"
        }
      },
      "agentic ai & ai agents": {
        "eyebrow": "SERVICE",
        "title": "Agentic AI & AI Agents",
        "intro": [
          "AI agents go beyond answering questions. They can plan steps, use your software tools and complete multi-step tasks, such as qualifying leads, processing requests or preparing reports, with people approving the decisions that matter.",
          "Intellivex designs and builds AI agents that connect securely to your systems, follow your business rules and keep a clear record of every action, so you stay in control of what they do."
        ],
        "tags": [
          "Custom AI Agent Development",
          "Customer Service Agents",
          "Sales & Operations Agents",
          "Multi-Agent Workflows",
          "Tool & System Integration",
          "Human-in-the-Loop Controls"
        ],
        "benefits": {
          "description": "Well-designed agents take on repetitive, multi-step work around the clock, freeing your team for higher-value tasks while keeping humans in charge of important decisions.",
          "items": [
            "Automation of complex, multi-step tasks.",
            "Secure connections to your CRM, ERP and internal tools.",
            "Approval steps and audit trails for every action.",
            "Gradual rollout that starts with low-risk tasks."
          ]
        },
        "faqs": [
          {
            "question": "What is an AI agent?",
            "answer": "An AI agent is software powered by a language model that can reason through a task, decide which tools to use and take actions, rather than only generating text."
          },
          {
            "question": "How is an agent different from a chatbot?",
            "answer": "A chatbot mainly answers questions. An agent can also act: updating records, sending emails, booking appointments or triggering workflows within the limits you set."
          },
          {
            "question": "How do you keep agents from making mistakes?",
            "answer": "We limit permissions, add validation checks, require human approval for sensitive actions and monitor agent activity. Agents start with narrow, well-defined tasks."
          },
          {
            "question": "Which systems can agents work with?",
            "answer": "Any system with an API, including Salesforce, HubSpot, Microsoft 365, Google Workspace, Slack, Zendesk and your own applications."
          },
          {
            "question": "How long does it take to deploy an agent?",
            "answer": "A focused agent for one workflow can often be piloted in six to ten weeks, depending on integrations and approvals."
          },
          {
            "question": "Can agents work in regulated industries?",
            "answer": "Yes, with care. We design for strict access control, logging and human oversight to support requirements in sectors such as healthcare and finance."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Put AI agents to work on your busiest workflows while your team stays in control. Let's design your first agent.",
          "button": "CONTACT US"
        }
      },
      "custom ai & llm development": {
        "eyebrow": "SERVICE",
        "title": "Custom AI & LLM Development",
        "intro": [
          "Off-the-shelf AI tools don't know your products, policies or customers. Intellivex builds custom AI applications powered by large language models (LLMs) that work with your own data and fit directly into your workflows.",
          "We use techniques such as retrieval-augmented generation (RAG) to ground answers in your documents, and fine-tuning when it adds clear value. Every solution includes evaluation, monitoring and security controls so it performs reliably in production."
        ],
        "tags": [
          "LLM Application Development",
          "Retrieval-Augmented Generation (RAG)",
          "AI Chatbots & Assistants",
          "Model Fine-Tuning",
          "Document Processing & Extraction",
          "LLM Evaluation & Monitoring"
        ],
        "benefits": {
          "description": "Custom LLM solutions give your team and customers accurate, context-aware answers based on your own knowledge, inside the tools they already use.",
          "items": [
            "Answers grounded in your own documents and data.",
            "Private deployment options within your cloud.",
            "Testing and evaluation to improve accuracy over time.",
            "Integration with your apps, website and internal systems."
          ]
        },
        "faqs": [
          {
            "question": "What is RAG?",
            "answer": "Retrieval-augmented generation lets an AI model search your approved documents and use them to answer questions, which improves accuracy and allows answers to cite sources."
          },
          {
            "question": "Do we need to train our own model?",
            "answer": "Usually not. Most business needs are met by existing models combined with your data through RAG. Fine-tuning is useful for specific tone, format or specialized tasks."
          },
          {
            "question": "How do you reduce incorrect answers?",
            "answer": "We ground responses in your data, test against real questions, add citations and fallbacks, and monitor quality after launch. No AI is perfect, so we design for human review where it matters."
          },
          {
            "question": "Can the AI run in our own environment?",
            "answer": "Yes. We can deploy using Azure OpenAI, Amazon Bedrock, Google Vertex AI or open-source models hosted in your cloud."
          },
          {
            "question": "Will our data be used to train public models?",
            "answer": "We use enterprise services and configurations that don't use your data to train public models, and we review each provider's terms with you."
          },
          {
            "question": "What does it cost to run an LLM application?",
            "answer": "Running costs depend on usage volume and the model chosen. We estimate costs early and optimize with caching and right-sized models."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Build AI that knows your business and works inside your systems. Let's discuss your use case.",
          "button": "CONTACT US"
        }
      },
      "machine learning & predictive analytics": {
        "eyebrow": "SERVICE",
        "title": "Machine Learning & Predictive Analytics",
        "intro": [
          "Your historical data holds patterns that can help you plan ahead: which customers may leave, how much stock you'll need, which transactions look suspicious. Intellivex builds machine learning models that turn those patterns into reliable predictions your team can act on.",
          "We handle the full lifecycle, from data preparation and model development to deployment, monitoring and retraining, so predictions stay accurate as your business and data change."
        ],
        "tags": [
          "Demand Forecasting",
          "Customer Churn Prediction",
          "Fraud & Anomaly Detection",
          "Recommendation Engines",
          "Computer Vision",
          "MLOps & Model Monitoring"
        ],
        "benefits": {
          "description": "Predictive analytics helps you act earlier and with more confidence, whether that means keeping customers, reducing waste or catching problems before they grow.",
          "items": [
            "Data-driven forecasts for better planning.",
            "Earlier warning of churn, fraud or equipment issues.",
            "Models explained in clear business terms.",
            "Ongoing monitoring to keep predictions accurate."
          ]
        },
        "faqs": [
          {
            "question": "What kinds of problems can machine learning solve?",
            "answer": "Forecasting, classification, recommendations, anomaly detection and image recognition are common examples. We help you decide whether ML is the right tool or a simpler approach would work."
          },
          {
            "question": "How much data do we need?",
            "answer": "It depends on the problem. Many useful models can be built with one to two years of historical records. We assess your data quality and volume first."
          },
          {
            "question": "How accurate will the predictions be?",
            "answer": "Accuracy depends on your data and the problem. We set realistic targets, measure against a baseline and share results transparently before deployment."
          },
          {
            "question": "Can you explain how the model makes decisions?",
            "answer": "Yes. We use explainability techniques to show which factors drive predictions, which builds trust and supports regulatory needs."
          },
          {
            "question": "What is MLOps?",
            "answer": "MLOps is the practice of deploying, monitoring and updating machine learning models reliably in production, similar to DevOps for software."
          },
          {
            "question": "Can predictions appear in the tools we already use?",
            "answer": "Yes. We deliver predictions into dashboards, CRMs, ERPs or applications through APIs."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Use your data to see what's coming and act sooner. Let's explore your prediction opportunities.",
          "button": "CONTACT US"
        }
      },
      "data science & business intelligence": {
        "eyebrow": "SERVICE",
        "title": "Data Science & Business Intelligence",
        "intro": [
          "Many businesses have plenty of data but struggle to get clear answers from it. Intellivex brings your data together, cleans it and turns it into dashboards and analysis that help leaders make faster, better-informed decisions.",
          "We build modern data platforms and reporting on tools such as Power BI, Tableau, Looker, Snowflake and Databricks, giving every team one trusted version of the numbers."
        ],
        "tags": [
          "Data Strategy & Assessment",
          "Data Warehousing & Pipelines",
          "Power BI & Tableau Dashboards",
          "KPI & Executive Reporting",
          "Advanced Analytics",
          "Data Governance & Quality"
        ],
        "benefits": {
          "description": "Reliable, timely data replaces spreadsheet work and debates over whose numbers are right, so your team can focus on acting on insights.",
          "items": [
            "One trusted source of truth for key metrics.",
            "Automated reports that replace manual spreadsheet work.",
            "Interactive dashboards for leaders and teams.",
            "Data governance that improves quality and security."
          ]
        },
        "faqs": [
          {
            "question": "What is business intelligence?",
            "answer": "Business intelligence is the process of collecting, organizing and visualizing data so people can understand performance and make informed decisions."
          },
          {
            "question": "Which BI tool should we use?",
            "answer": "Power BI is popular with Microsoft-based companies, Tableau excels at visual exploration, and Looker suits Google Cloud users. We recommend based on your stack and budget."
          },
          {
            "question": "Our data is spread across many systems. Can you combine it?",
            "answer": "Yes. We build data pipelines that pull from your CRM, ERP, finance, marketing and operational systems into a central warehouse."
          },
          {
            "question": "How long does it take to build our first dashboard?",
            "answer": "A first set of dashboards on well-understood data can often be delivered in four to six weeks."
          },
          {
            "question": "How do you ensure data accuracy?",
            "answer": "We add validation checks to pipelines, define metrics clearly with stakeholders and set up data quality monitoring."
          },
          {
            "question": "Can our team update the dashboards themselves?",
            "answer": "Yes. We design for self-service and train your team to explore data and build their own reports."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Turn scattered data into clear, trusted insights for every decision. Let's map your data landscape.",
          "button": "CONTACT US"
        }
      },
      "intelligent automation": {
        "eyebrow": "SERVICE",
        "title": "Intelligent Automation",
        "intro": [
          "Repetitive tasks like data entry, invoice processing and report preparation consume hours your team could spend on meaningful work. Intellivex combines workflow automation, robotic process automation (RPA) and AI to handle these tasks quickly and consistently.",
          "AI lets automation go further than simple rules: reading documents, understanding emails and making routine decisions, with exceptions routed to people for review."
        ],
        "tags": [
          "Process Discovery & Mapping",
          "Robotic Process Automation (RPA)",
          "Intelligent Document Processing",
          "Workflow Automation",
          "Power Automate & Low-Code Solutions",
          "Automation Monitoring & Support"
        ],
        "benefits": {
          "description": "Automation reduces errors, speeds up turnaround times and lets your business grow without adding the same amount of administrative work.",
          "items": [
            "Hours of manual work returned to your team.",
            "Fewer errors in repetitive processes.",
            "Faster processing of documents and requests.",
            "Clear tracking of automated tasks and exceptions."
          ]
        },
        "faqs": [
          {
            "question": "Which processes are best for automation?",
            "answer": "High-volume, rule-based tasks with clear inputs, such as invoice processing, order entry, onboarding and reporting, usually deliver the fastest returns."
          },
          {
            "question": "What is the difference between RPA and intelligent automation?",
            "answer": "RPA follows fixed rules to mimic clicks and keystrokes. Intelligent automation adds AI to handle unstructured content like emails, PDFs and scanned forms."
          },
          {
            "question": "Which tools do you use?",
            "answer": "We work with Microsoft Power Automate, UiPath, Zapier, n8n and custom code, choosing what fits your systems and budget."
          },
          {
            "question": "How quickly can we see results?",
            "answer": "A first automated process can often go live within four to eight weeks."
          },
          {
            "question": "What happens when the automation can't handle something?",
            "answer": "Exceptions are flagged and routed to the right person, with full context, so nothing falls through the cracks."
          },
          {
            "question": "How do we measure the return on automation?",
            "answer": "We measure time saved, error rates and processing times before and after, so you can see the impact clearly."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Free your team from repetitive work with automation that's smart enough to handle the details. Let's find your first process.",
          "button": "CONTACT US"
        }
      },
      "ai readiness workshops": {
        "eyebrow": "SERVICE",
        "title": "AI Readiness Workshops",
        "intro": [
          "Not sure where AI fits in your business? Intellivex AI Readiness Workshops bring your leaders and teams together to understand what AI can realistically do, identify the best opportunities and plan practical next steps.",
          "Our facilitators combine education, hands-on demos and structured discussion. You leave with a prioritized list of use cases, an assessment of your data and technology readiness, and a clear roadmap."
        ],
        "tags": [
          "Executive AI Briefings",
          "Use Case Ideation Sessions",
          "Data & Technology Readiness Review",
          "Hands-On AI Tool Training",
          "Responsible AI & Governance",
          "AI Roadmap Development"
        ],
        "benefits": {
          "description": "A workshop aligns your leadership team, builds AI literacy across departments and gives you a confident starting point, without committing to a large project up front.",
          "items": [
            "Shared understanding of AI across leadership and teams.",
            "Prioritized use cases ranked by value and feasibility.",
            "An honest view of your data and technology readiness.",
            "A practical roadmap with clear next steps."
          ]
        },
        "faqs": [
          {
            "question": "Who should attend the workshop?",
            "answer": "We recommend a mix of executives, department leaders and people who know day-to-day operations, along with IT representatives."
          },
          {
            "question": "How long is a workshop?",
            "answer": "Workshops typically run from a half day to two days, depending on scope and the number of departments involved."
          },
          {
            "question": "Do participants need technical knowledge?",
            "answer": "No. Sessions are designed for business audiences, with technical deep dives available for IT teams if needed."
          },
          {
            "question": "What do we receive afterward?",
            "answer": "A written report with prioritized use cases, readiness findings, risks and a recommended roadmap."
          },
          {
            "question": "Can the workshop be tailored to our industry?",
            "answer": "Yes. We adapt examples and use cases to your industry and goals."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Start your AI journey with clarity and a plan your whole team believes in. Book a workshop.",
          "button": "CONTACT US"
        }
      }
    }
  },
  "web development": {
    "eyebrow": "SERVICE",
    "title": "Web Development",
    "intro": [
      "We build fast, secure, conversion-focused websites and web apps that deliver seamless experiences on every device.",
      "Your website is often the first conversation you have with a customer. Intellivex combines strategy, design and engineering to create sites that load quickly, rank well in search, meet accessibility standards and turn visitors into leads and sales."
    ],
    "tags": [
      "Custom Web Applications",
      "E-Commerce Development",
      "CMS Development",
      "Progressive Web Apps (PWA)",
      "Web UI/UX Design",
      "Website Care & Maintenance"
    ],
    "benefits": {
      "description": "We build websites as business tools, not just digital brochures, with clear goals, measurable results and a platform your team can update easily.",
      "items": [
        "Fast, mobile-first sites built for Core Web Vitals.",
        "SEO-friendly structure from the first page.",
        "Accessibility aligned with WCAG 2.2 AA guidelines.",
        "Analytics set up to track leads and conversions."
      ]
    },
    "faqs": [
      {
        "question": "How long does it take to build a website?",
        "answer": "A marketing website typically takes six to ten weeks. Larger sites, e-commerce stores and web applications take longer, and we provide a timeline after discovery."
      },
      {
        "question": "Which platform should we use?",
        "answer": "It depends on your goals. WordPress, Webflow and headless CMS platforms suit content-driven sites, Shopify suits many online stores, and custom frameworks suit complex web applications."
      },
      {
        "question": "Will our website be mobile-friendly?",
        "answer": "Yes. Every site is designed and tested for phones, tablets and desktops."
      },
      {
        "question": "Do you help with SEO?",
        "answer": "We build sites with technical SEO best practices: fast loading, clean structure, metadata and schema markup. Ongoing content SEO can be added separately."
      },
      {
        "question": "Can we update the website ourselves?",
        "answer": "Yes. We set up an easy-to-use content management system and train your team."
      },
      {
        "question": "Do you offer hosting and maintenance?",
        "answer": "Yes. Our Website Care plans cover hosting management, updates, backups, security monitoring and small content changes."
      }
    ],
    "cta": {
      "heading": "Reimagine your business with Intellivex",
      "text": "Get a website that looks great, loads fast and turns visitors into customers. Let's plan your next site.",
      "button": "CONTACT US"
    },
    "subs": {
      "custom web applications": {
        "eyebrow": "SERVICE",
        "title": "Custom Web Applications",
        "intro": [
          "Some business needs go beyond a website: customer portals, booking systems, dashboards, internal tools or full SaaS platforms. Intellivex builds custom web applications that run in any browser, scale with your users and connect with the systems you already rely on.",
          "We use proven frameworks such as React, Next.js, Angular, Node.js and .NET, and build with security, performance and maintainability in mind from day one."
        ],
        "tags": [
          "Customer & Partner Portals",
          "SaaS Platforms",
          "Internal Business Tools",
          "Dashboards & Admin Panels",
          "Booking & Scheduling Systems",
          "Third-Party Integrations"
        ],
        "benefits": {
          "description": "Web applications are easy to roll out, with no installs or app store approvals, and can be updated instantly for every user.",
          "items": [
            "Accessible from any device with a browser.",
            "Secure user accounts, roles and permissions.",
            "Scalable cloud hosting that grows with demand.",
            "Integration with your CRM, ERP and payment systems."
          ]
        },
        "faqs": [
          {
            "question": "What is the difference between a website and a web application?",
            "answer": "A website mainly presents information. A web application lets users log in, interact with data and complete tasks, such as booking, ordering or managing accounts."
          },
          {
            "question": "How much does a custom web application cost?",
            "answer": "Cost depends on features, integrations and complexity. We provide a detailed estimate after a discovery phase, and can start with an MVP to manage budget."
          },
          {
            "question": "How do you keep web apps secure?",
            "answer": "We follow OWASP guidelines, use secure authentication, encrypt sensitive data and run security testing before launch."
          },
          {
            "question": "Can the app handle growth in users?",
            "answer": "Yes. We design on scalable cloud infrastructure that can handle increased traffic without major rework."
          },
          {
            "question": "Do we own the code?",
            "answer": "Yes. You own the source code and all project deliverables."
          },
          {
            "question": "Can you add features later?",
            "answer": "Yes. We build in a modular way so new features can be added over time, and offer ongoing development plans."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Give your customers and team a web application built around how you work. Let's scope your project.",
          "button": "CONTACT US"
        }
      },
      "e-commerce development": {
        "eyebrow": "SERVICE",
        "title": "E-Commerce Development",
        "intro": [
          "Online shoppers expect fast pages, easy checkout and a smooth experience on their phones. Intellivex builds e-commerce stores that make buying simple and give you the tools to manage products, orders and customers efficiently.",
          "We work with Shopify, WooCommerce, BigCommerce and headless commerce setups, and integrate with payment, shipping, tax and inventory systems used across the US and Canada."
        ],
        "tags": [
          "Shopify & Shopify Plus",
          "WooCommerce",
          "Headless Commerce",
          "B2B E-Commerce",
          "Payment & Shipping Integration",
          "Store Migration & Replatforming"
        ],
        "benefits": {
          "description": "A well-built store reduces cart abandonment, improves average order value and saves your team time on daily operations.",
          "items": [
            "Fast, mobile-optimized shopping experiences.",
            "Streamlined checkout with trusted payment options.",
            "Integration with inventory, ERP and fulfillment tools.",
            "US and Canadian tax, currency and shipping setup."
          ]
        },
        "faqs": [
          {
            "question": "Which e-commerce platform is right for us?",
            "answer": "Shopify suits most small to mid-sized retailers. WooCommerce works well for WordPress-based businesses. Headless setups suit brands needing highly custom experiences. We recommend based on your catalog, budget and growth plans."
          },
          {
            "question": "Can you migrate our existing store?",
            "answer": "Yes. We migrate products, customers, order history and SEO redirects to protect your rankings."
          },
          {
            "question": "Do you handle sales tax and multiple currencies?",
            "answer": "Yes. We configure US sales tax, Canadian GST/HST/PST, and display prices in USD and CAD where needed."
          },
          {
            "question": "How do you keep payment data secure?",
            "answer": "We use PCI DSS-compliant payment providers such as Stripe, Shopify Payments, PayPal and Moneris, so card data is handled by the provider rather than stored on your site."
          },
          {
            "question": "Can you integrate our store with our ERP or warehouse?",
            "answer": "Yes. We connect stores to systems like NetSuite, QuickBooks and third-party logistics providers."
          },
          {
            "question": "Do you build B2B stores?",
            "answer": "Yes. We support wholesale pricing, customer-specific catalogs, quote requests and bulk ordering."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Build an online store that's easy to shop and easy to run. Let's talk about your e-commerce goals.",
          "button": "CONTACT US"
        }
      },
      "cms development": {
        "eyebrow": "SERVICE",
        "title": "CMS Development",
        "intro": [
          "Your marketing team shouldn't need a developer to update a headline or publish a blog post. Intellivex builds content management systems that make it easy for your team to create, edit and publish content while keeping your brand consistent.",
          "We develop on WordPress, Webflow, Drupal and headless platforms such as Contentful, Sanity and Strapi, choosing the right fit for your content, team and growth plans."
        ],
        "tags": [
          "WordPress Development",
          "Webflow Development",
          "Headless CMS (Contentful, Sanity, Strapi)",
          "Custom Themes & Components",
          "Multilingual Sites (English & French)",
          "CMS Migration"
        ],
        "benefits": {
          "description": "A well-structured CMS speeds up publishing, keeps content organized and gives your marketing team independence, without risking the look or performance of your site.",
          "items": [
            "Easy editing with reusable page building blocks.",
            "Roles and approval workflows for your team.",
            "Fast, secure and SEO-friendly setup.",
            "Multilingual support for US and Canadian audiences."
          ]
        },
        "faqs": [
          {
            "question": "Which CMS is best for our business?",
            "answer": "WordPress is flexible and widely supported. Webflow offers visual editing with clean code. Headless CMS platforms suit brands publishing content across websites, apps and other channels. We help you choose."
          },
          {
            "question": "What is a headless CMS?",
            "answer": "A headless CMS stores and manages content separately from how it's displayed, so the same content can power your website, mobile app and other channels."
          },
          {
            "question": "Can you migrate our content from another CMS?",
            "answer": "Yes. We migrate pages, posts, media and metadata, and set up redirects to protect your search rankings."
          },
          {
            "question": "Can you build a bilingual English and French site?",
            "answer": "Yes. We set up multilingual content structures, which is especially important for audiences in Quebec and across Canada."
          },
          {
            "question": "Is WordPress secure?",
            "answer": "WordPress can be very secure when properly maintained. We use trusted plugins, hardened configurations, regular updates and managed hosting."
          },
          {
            "question": "Will you train our team?",
            "answer": "Yes. We provide hands-on training and simple guides so your team can manage content confidently."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Give your team a website they can update with ease. Let's find the right CMS for you.",
          "button": "CONTACT US"
        }
      },
      "progressive web apps (pwa)": {
        "eyebrow": "SERVICE",
        "title": "Progressive Web Apps",
        "intro": [
          "Progressive web apps combine the reach of a website with the feel of a mobile app. Users can add them to their home screen, use them on slow connections and receive notifications, all without an app store download.",
          "Intellivex builds PWAs that load quickly, work reliably on any device and cost less to build and maintain than separate native apps, making them a strong option for many businesses."
        ],
        "tags": [
          "PWA Development",
          "Offline Functionality",
          "Push Notifications",
          "Website-to-PWA Conversion",
          "Performance Optimization",
          "App-Like UI Design"
        ],
        "benefits": {
          "description": "A PWA lets you deliver an app-like experience to every user through a single codebase, while keeping the discoverability of the web.",
          "items": [
            "One codebase for desktop, Android and iPhone.",
            "Fast loading, even on slower networks.",
            "Installable without app store approval.",
            "Lower development and maintenance costs."
          ]
        },
        "faqs": [
          {
            "question": "What is a progressive web app?",
            "answer": "A PWA is a website built with modern web technologies that behaves like an app: it can be installed, work offline and send notifications."
          },
          {
            "question": "Do PWAs work on iPhone?",
            "answer": "Yes. iOS supports installing PWAs to the home screen and, on recent versions, web push notifications. Some device features remain more limited than on Android."
          },
          {
            "question": "When should we choose a PWA over a native app?",
            "answer": "PWAs suit content, commerce and service apps where reach and cost matter most. Native apps are better when you need deep device integration or app store presence."
          },
          {
            "question": "Can a PWA work offline?",
            "answer": "Yes. We cache key content and features so users can keep working without a connection, syncing when they're back online."
          },
          {
            "question": "Can you convert our existing website into a PWA?",
            "answer": "Often, yes. We add PWA capabilities to existing sites where the architecture supports it."
          },
          {
            "question": "Can a PWA be listed in app stores?",
            "answer": "In some cases. PWAs can be packaged for Google Play and, with more work, for other stores."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Deliver an app-like experience to every user, straight from the browser. Let's explore whether a PWA fits.",
          "button": "CONTACT US"
        }
      },
      "web ui/ux design": {
        "eyebrow": "SERVICE",
        "title": "Web UI/UX Design",
        "intro": [
          "Visitors form an impression of your website in seconds. Intellivex designs websites and web apps that look professional, guide users clearly toward their goals and make every interaction feel effortless.",
          "Our process moves from research and information architecture to wireframes, prototypes and final visual design, with user testing and accessibility built in at every stage."
        ],
        "tags": [
          "UX Research & Audits",
          "Information Architecture",
          "Wireframes & Prototypes",
          "Visual & Brand Design",
          "Design Systems",
          "Conversion Rate Optimization"
        ],
        "benefits": {
          "description": "Thoughtful design reduces bounce rates, increases conversions and strengthens your brand, while a shared design system makes future pages faster to build.",
          "items": [
            "Clear user journeys that lead to action.",
            "Designs validated with real users before development.",
            "Consistent design systems for faster future work.",
            "Accessible layouts aligned with WCAG guidelines."
          ]
        },
        "faqs": [
          {
            "question": "What is a UX audit?",
            "answer": "A review of your current site using analytics, heuristics and user feedback to identify where visitors struggle, with prioritized recommendations."
          },
          {
            "question": "Do you design in Figma?",
            "answer": "Yes. Figma lets your team review, comment and collaborate in real time, and makes developer handoff smooth."
          },
          {
            "question": "Can you improve our conversion rate?",
            "answer": "We identify friction points and test design changes to improve conversions. Results vary by site and traffic, so we measure impact rather than promise numbers."
          },
          {
            "question": "Do you create design systems?",
            "answer": "Yes. We create reusable components, styles and guidelines that keep your brand consistent across pages and products."
          },
          {
            "question": "How do you make sites accessible?",
            "answer": "We design for color contrast, readable typography, keyboard navigation and screen readers, following WCAG 2.2 AA guidelines."
          },
          {
            "question": "Can you work with our existing brand guidelines?",
            "answer": "Yes. We build on your brand, or help refresh it if needed."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Create a web experience that's clear, attractive and built to convert. Let's design it together.",
          "button": "CONTACT US"
        }
      },
      "website care & maintenance": {
        "eyebrow": "SERVICE",
        "title": "Website Care & Maintenance",
        "intro": [
          "A website needs regular care to stay fast, secure and effective. Outdated plugins, expired certificates and slow pages can cost you visitors, search rankings and trust. Intellivex takes care of the technical upkeep so your site keeps working for your business.",
          "Our care plans include updates, backups, security monitoring, performance checks and a set amount of time each month for content changes and small improvements."
        ],
        "tags": [
          "Software & Plugin Updates",
          "Daily Backups",
          "Security Monitoring",
          "Uptime Monitoring",
          "Performance Optimization",
          "Content Updates & Support"
        ],
        "benefits": {
          "description": "Regular maintenance prevents small issues from becoming expensive emergencies and gives you a dependable team to call when you need changes.",
          "items": [
            "Fewer security risks from outdated software.",
            "Reliable backups and quick recovery if something goes wrong.",
            "Ongoing performance and SEO health checks.",
            "Monthly reports on site health and work completed."
          ]
        },
        "faqs": [
          {
            "question": "What does a website care plan include?",
            "answer": "Core updates, plugin updates, backups, security and uptime monitoring, performance checks and a set number of support hours each month."
          },
          {
            "question": "Can you maintain a site you didn't build?",
            "answer": "Yes. We start with a site audit, fix urgent issues and then move to regular maintenance."
          },
          {
            "question": "What happens if our site goes down?",
            "answer": "Uptime monitoring alerts us, and we work to restore service as quickly as possible, using backups if needed."
          },
          {
            "question": "How often are backups taken?",
            "answer": "We typically take daily backups stored off-site, with more frequent options for busy e-commerce sites."
          },
          {
            "question": "Can you also handle hosting?",
            "answer": "Yes. We can manage hosting on reliable providers, or work with your current host."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Keep your website secure, fast and up to date without the hassle. Choose a care plan that fits.",
          "button": "CONTACT US"
        }
      }
    }
  },
  "game development": {
    "eyebrow": "SERVICE",
    "title": "Game Development",
    "intro": [
      "We craft immersive, engaging games for mobile, web and PC, from creative concept to global launch and LiveOps.",
      "Intellivex brings together game designers, artists and engineers who care about both the fun and the business. We help you shape your idea, build a playable prototype early, refine it with real player feedback, and keep the game growing after launch."
    ],
    "tags": [
      "Mobile Game Development",
      "Multiplayer & Online Games",
      "2D & 3D Game Art & Design",
      "Unity Development",
      "LiveOps & Post-Launch Updates",
      "Gamification & Educational Games"
    ],
    "benefits": {
      "description": "We help you reduce risk with early prototypes and playtesting, then deliver a polished game with the analytics and live operations needed to keep players engaged.",
      "items": [
        "Playable prototypes early in development.",
        "Full-cycle team: design, art, engineering and QA.",
        "Performance tuned for a wide range of devices.",
        "Analytics and LiveOps planning built in from the start."
      ]
    },
    "faqs": [
      {
        "question": "Can you help turn our game idea into a concept?",
        "answer": "Yes. We run concept and pre-production phases to define gameplay, art direction, monetization and scope before full development."
      },
      {
        "question": "How long does it take to make a game?",
        "answer": "A casual mobile game can take four to eight months; larger or multiplayer titles take longer. We provide a roadmap after pre-production."
      },
      {
        "question": "Do you work on existing games?",
        "answer": "Yes. We can add features, fix performance issues, port to new platforms or take over LiveOps."
      },
      {
        "question": "Who owns the game and its assets?",
        "answer": "You do. All code, art and design assets are transferred to you under our agreement."
      },
      {
        "question": "Do you help with monetization?",
        "answer": "Yes. We design fair, player-friendly monetization, including in-app purchases, ads and subscriptions, balanced with long-term retention."
      }
    ],
    "cta": {
      "heading": "Reimagine your business with Intellivex",
      "text": "Bring your game idea to life with a team that balances creativity and craft. Let's talk about your game.",
      "button": "CONTACT US"
    },
    "subs": {
      "mobile game development": {
        "eyebrow": "SERVICE",
        "title": "Mobile Game Development",
        "intro": [
          "Mobile is where most players are, and where competition for their attention is toughest. Intellivex develops mobile games for iOS and Android that are easy to pick up, satisfying to play and built to keep players returning.",
          "From hyper-casual and puzzle games to mid-core titles, we handle design, art, development, testing and store launch, with analytics in place to guide improvements."
        ],
        "tags": [
          "Casual & Puzzle Games",
          "Hyper-Casual Games",
          "Mid-Core Games",
          "iOS & Android Launch",
          "Monetization Design",
          "Game Analytics Integration"
        ],
        "benefits": {
          "description": "We design mobile games around short, rewarding sessions and smooth performance on a wide range of devices, which are key factors for retention and ratings.",
          "items": [
            "Intuitive touch controls and onboarding.",
            "Optimized performance on older and newer devices.",
            "Balanced monetization that respects players.",
            "Analytics to track retention and engagement."
          ]
        },
        "faqs": [
          {
            "question": "What genres do you develop?",
            "answer": "Casual, puzzle, hyper-casual, arcade, simulation and mid-core genres, as well as branded and educational games."
          },
          {
            "question": "Which engine do you use?",
            "answer": "We primarily use Unity for mobile games, which offers strong cross-platform support and a mature ecosystem."
          },
          {
            "question": "How do you test mobile games?",
            "answer": "We test on a range of real devices for performance, gameplay balance and bugs, and run playtests to gather player feedback."
          },
          {
            "question": "Can you help publish the game?",
            "answer": "Yes. We handle App Store and Google Play submissions, including store listings and compliance with platform policies."
          },
          {
            "question": "How do mobile games make money?",
            "answer": "Common models include in-app purchases, rewarded ads, subscriptions and premium pricing. We help you choose a model that fits your game and audience."
          },
          {
            "question": "Do you support games after launch?",
            "answer": "Yes. We offer LiveOps and maintenance to keep your game fresh and running smoothly."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Create a mobile game players want to come back to every day. Let's start with your concept.",
          "button": "CONTACT US"
        }
      },
      "multiplayer & online games": {
        "eyebrow": "SERVICE",
        "title": "Multiplayer & Online Games",
        "intro": [
          "Playing together keeps players engaged longer. Intellivex builds multiplayer and online games with reliable networking, fair matchmaking and scalable servers that can grow with your player base.",
          "We design for real-world network conditions, protect against common cheating methods and use cloud infrastructure so you can scale up for launch day and scale down when demand settles."
        ],
        "tags": [
          "Real-Time Multiplayer",
          "Turn-Based & Asynchronous Games",
          "Matchmaking & Lobbies",
          "Game Servers & Backend",
          "Leaderboards & Social Features",
          "Anti-Cheat Measures"
        ],
        "benefits": {
          "description": "A solid online foundation means smoother matches, fewer disconnects and a backend ready to support updates, events and community features.",
          "items": [
            "Responsive networking tuned for real-world connections.",
            "Scalable cloud servers for launch and growth.",
            "Social features that build community.",
            "Server-side checks to reduce cheating."
          ]
        },
        "faqs": [
          {
            "question": "What is the difference between real-time and turn-based multiplayer?",
            "answer": "Real-time games sync players instantly, like shooters or racing games. Turn-based games let players take turns, which is simpler to build and more forgiving on slower connections."
          },
          {
            "question": "Which multiplayer technologies do you use?",
            "answer": "We work with Unity Netcode, Photon, Mirror, PlayFab, Nakama and custom backends, depending on your game's needs."
          },
          {
            "question": "How do you handle lag?",
            "answer": "We use techniques such as client prediction and lag compensation, and host servers in regions close to your players."
          },
          {
            "question": "How do you prevent cheating?",
            "answer": "We validate key actions on the server, monitor for suspicious behavior and apply anti-cheat tools. No system stops all cheating, but these measures reduce it significantly."
          },
          {
            "question": "Can the backend handle a big launch?",
            "answer": "We load test before launch and use auto-scaling cloud infrastructure to handle traffic spikes."
          },
          {
            "question": "Do you add social features like friends and chat?",
            "answer": "Yes. We build friends lists, clans, chat, leaderboards and events, with moderation tools where needed."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Bring players together with a multiplayer game built to perform at scale. Let's plan your online experience.",
          "button": "CONTACT US"
        }
      },
      "2d & 3d game art & design": {
        "eyebrow": "SERVICE",
        "title": "2D & 3D Game Art & Design",
        "intro": [
          "Art and design give a game its personality and make it memorable. Intellivex creates characters, environments, UI and animations, and designs the gameplay systems and levels that bring them to life.",
          "Our artists and designers work closely with engineers so every asset looks great and performs well in-engine, whether your style is bright and stylized or detailed and realistic."
        ],
        "tags": [
          "Concept Art & Art Direction",
          "2D Characters & Environments",
          "3D Modeling & Texturing",
          "Animation & VFX",
          "Game UI/UX Design",
          "Level & Gameplay Design"
        ],
        "benefits": {
          "description": "A consistent visual style and well-designed gameplay help your game stand out in crowded stores and keep players engaged from the first minute.",
          "items": [
            "A distinct art style aligned with your audience.",
            "Assets optimized for smooth in-game performance.",
            "Clear, intuitive game UI and menus.",
            "Level and gameplay design focused on player engagement."
          ]
        },
        "faqs": [
          {
            "question": "Can you create art for a game another studio is developing?",
            "answer": "Yes. We provide art and design services independently and integrate with your team's pipeline and tools."
          },
          {
            "question": "Which art styles do you work in?",
            "answer": "We work across a range of styles, including cartoon, pixel art, low-poly, stylized 3D and semi-realistic."
          },
          {
            "question": "What tools do your artists use?",
            "answer": "Common tools include Photoshop, Blender, Maya, Substance Painter, Spine and Unity's built-in tools."
          },
          {
            "question": "How do you make sure assets perform well?",
            "answer": "We follow polygon, texture and memory budgets for each target platform and test assets in-engine."
          },
          {
            "question": "Do you design game mechanics as well as visuals?",
            "answer": "Yes. Our game designers create core loops, progression systems, levels and balancing."
          },
          {
            "question": "Who owns the artwork?",
            "answer": "You do. All artwork and source files are transferred to you under our agreement."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Give your game a look and feel players remember. Let's bring your world to life.",
          "button": "CONTACT US"
        }
      },
      "unity development": {
        "eyebrow": "SERVICE",
        "title": "Unity Development",
        "intro": [
          "Unity powers a large share of mobile and indie games, as well as interactive training and simulation apps. Intellivex builds Unity projects that run smoothly across mobile, web, PC and XR, from a single, well-organized codebase.",
          "Our Unity developers focus on clean architecture, performance optimization and tools that make your team more productive, whether we're starting a new project or improving an existing one."
        ],
        "tags": [
          "Unity Game Development",
          "Cross-Platform Porting",
          "Performance Optimization",
          "AR & VR Experiences",
          "Custom Tools & Plugins",
          "Unity Project Rescue"
        ],
        "benefits": {
          "description": "Unity lets you reach multiple platforms efficiently. Our experience helps you avoid common pitfalls such as frame drops, long load times and hard-to-maintain code.",
          "items": [
            "One codebase for multiple platforms.",
            "Smooth frame rates and fast load times.",
            "Clean, maintainable project structure.",
            "Support for AR, VR and interactive 3D apps."
          ]
        },
        "faqs": [
          {
            "question": "Why use Unity?",
            "answer": "Unity is widely used, supports many platforms and has a large asset and developer ecosystem, which makes development faster and talent easier to find."
          },
          {
            "question": "Can you port our game to new platforms?",
            "answer": "Yes. We port Unity projects between mobile, PC, web and other platforms, adapting controls, UI and performance."
          },
          {
            "question": "Our Unity project has performance problems. Can you help?",
            "answer": "Yes. We profile your game, identify bottlenecks in rendering, scripts or memory, and fix them."
          },
          {
            "question": "Do you build non-game apps in Unity?",
            "answer": "Yes. We build training simulations, product visualizations and AR/VR experiences for businesses."
          },
          {
            "question": "Can you take over an unfinished Unity project?",
            "answer": "Yes. We review the codebase, stabilize it and create a plan to complete or improve the project."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Build or improve your Unity project with a team that knows the engine inside out. Let's discuss your project.",
          "button": "CONTACT US"
        }
      },
      "liveops & post-launch updates": {
        "eyebrow": "SERVICE",
        "title": "LiveOps & Post-Launch Updates",
        "intro": [
          "Today's successful games are never really finished. Intellivex runs LiveOps that keep your game fresh with new content, events and improvements, guided by player data and feedback.",
          "We plan content calendars, run seasonal events, balance economies, fix bugs and monitor key metrics such as retention and revenue, so your game keeps growing long after launch."
        ],
        "tags": [
          "Live Events & Seasons",
          "Content Updates",
          "Player Analytics",
          "Economy & Balance Tuning",
          "A/B Testing",
          "Bug Fixes & Performance Updates"
        ],
        "benefits": {
          "description": "Consistent LiveOps can extend a game's lifespan, improve retention and build a loyal community that looks forward to every update.",
          "items": [
            "Regular content that keeps players returning.",
            "Data-driven decisions on features and balance.",
            "Faster bug fixes and stability improvements.",
            "Clear reporting on key player metrics."
          ]
        },
        "faqs": [
          {
            "question": "What is LiveOps?",
            "answer": "LiveOps (live operations) means continuously running and updating a game after launch with events, new content, offers and improvements."
          },
          {
            "question": "Which metrics do you track?",
            "answer": "Common metrics include day 1, 7 and 30 retention, session length, conversion rate and average revenue per user."
          },
          {
            "question": "Can you run LiveOps for a game built by another studio?",
            "answer": "Yes. We review the codebase and tools first, then set up a LiveOps plan and calendar."
          },
          {
            "question": "How often should we release updates?",
            "answer": "It depends on your game and team. Many mobile games release content or events every two to four weeks."
          },
          {
            "question": "Can you push content without a full app update?",
            "answer": "Yes. We set up remote configuration and content delivery so many changes can go live without store review."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Keep players engaged and your game growing long after launch. Let's plan your LiveOps.",
          "button": "CONTACT US"
        }
      },
      "gamification & educational games": {
        "eyebrow": "SERVICE",
        "title": "Gamification & Educational Games",
        "intro": [
          "Game mechanics can make learning stick and everyday tasks more motivating. Intellivex designs educational games and gamified experiences for schools, training teams and brands that want people to learn, practice and engage more.",
          "We combine instructional design with game design, building experiences that are fun to play while meeting clear learning or business objectives, and that track progress you can measure."
        ],
        "tags": [
          "Educational Game Development",
          "Corporate Training Games",
          "Gamified Apps & Platforms",
          "Serious Games & Simulations",
          "LMS Integration (SCORM, xAPI)",
          "Progress Tracking & Analytics"
        ],
        "benefits": {
          "description": "Well-designed gamification can increase participation and help people retain what they learn, while giving you data on progress and outcomes.",
          "items": [
            "Engaging learning experiences with clear objectives.",
            "Rewards, levels and challenges that motivate users.",
            "Integration with your LMS or existing platform.",
            "Measurable progress and completion reporting."
          ]
        },
        "faqs": [
          {
            "question": "What is gamification?",
            "answer": "Gamification applies game elements, such as points, levels, badges and challenges, to non-game activities like training, learning or customer loyalty."
          },
          {
            "question": "Who are educational games for?",
            "answer": "Schools, edtech companies, corporate training teams, healthcare organizations and nonprofits that want engaging ways to teach or inform."
          },
          {
            "question": "Can the game integrate with our LMS?",
            "answer": "Yes. We support SCORM and xAPI standards to report progress to most learning management systems."
          },
          {
            "question": "How do you make sure players actually learn?",
            "answer": "We define learning objectives first, design gameplay around them and test with real learners to confirm understanding."
          },
          {
            "question": "Do you design for accessibility?",
            "answer": "Yes. We consider readability, colorblind-friendly palettes, captions and adjustable difficulty so more people can participate."
          },
          {
            "question": "Can you gamify our existing app or platform?",
            "answer": "Yes. We add features such as challenges, streaks, rewards and leaderboards to existing products."
          }
        ],
        "cta": {
          "heading": "Reimagine your business with Intellivex",
          "text": "Make learning and engagement something people look forward to. Let's design your experience.",
          "button": "CONTACT US"
        }
      }
    }
  }
};

/** Content for a service page, or one of its sub-service pages. */
export function serviceDetailFor(serviceTitle, subTitle) {
  const service = SERVICE_DETAILS[serviceTitle?.toLowerCase()];
  if (!service) return null;
  return subTitle ? (service.subs[subTitle.toLowerCase()] ?? null) : service;
}

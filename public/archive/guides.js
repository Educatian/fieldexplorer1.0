window.LECTURE_GUIDES = {
  "knowledge-tracing-bkt-dkt": {
    "id": "knowledge-tracing-bkt-dkt",
    "purpose": "Use this lecture to compare how BKT and DKT estimate what a learner knows and to choose a model for a specific tutoring decision.",
    "distinction": "BKT uses interpretable prior-knowledge, learning, guess, and slip parameters, while DKT learns a more flexible representation of response sequences for prediction.",
    "caution": "The lecture's 0.809 versus 0.807 AUC comes from one small simulation, so treat it as illustrative and not as evidence about real learners or learning outcomes.",
    "koSummary": "이 강의는 학습자의 정오답 기록으로 지식 상태를 추정하는 베이지안 지식추적(BKT)과 딥러닝 기반 DKT를 비교합니다. 예측 성능만이 아니라 해석 가능성과 실제 교육적 의사결정에 맞는 모델을 고르라고 강조합니다.",
    "sources": [
      {
        "title": "Knowledge tracing: Modeling the acquisition of procedural knowledge",
        "authors": "Albert T. Corbett and John R. Anderson",
        "year": 1994,
        "url": "https://link.springer.com/article/10.1007/BF01099821",
        "relationship": "Further reading",
        "access": "abstract",
        "verificationNote": "Abstract excerpt checked; full text paywalled."
      },
      {
        "title": "How deep is knowledge tracing?",
        "authors": "Mohammad Khajah, Robert V. Lindsey, and Michael C. Mozer",
        "year": 2016,
        "url": "https://arxiv.org/abs/1604.02416",
        "relationship": "Further reading",
        "access": "Full text available · excerpt checked",
        "verificationNote": "arXiv abstract page read via search excerpt; full PDF not opened. Full text is available."
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "0P0xOb9frbA": {
    "id": "0P0xOb9frbA",
    "purpose": "Use this lecture to learn how lag sequential analysis turns coded turns into transition counts, probabilities, and adjusted residuals, and why sessions are the unit for group inference.",
    "distinction": "A high transitional probability is not the same as a transition that occurs more often than independence predicts, which is what expected counts and adjusted residuals test.",
    "caution": "The lecture uses a synthetic dataset, so the reported residuals and group comparison show how the method works and are not findings about real learners.",
    "koSummary": "이 강의는 한 코드 다음에 어떤 코드가 이어지는지 분석하는 지연 순차 분석(LSA)을 설명합니다. 전이 횟수, 확률, 기대값, 조정된 잔차를 구분하고, 영상의 집단 비교 예시에서는 개별 전이가 아니라 세션을 분석 단위로 사용합니다. 실제 분석 단위는 자료의 의존 구조에 맞게 정해야 합니다.",
    "sources": [
      {
        "title": "Sequential Analysis and Observational Methods for the Behavioral Sciences",
        "authors": "Roger Bakeman and Vicenç Quera",
        "year": 2011,
        "url": "https://www.cambridge.org/core/books/sequential-analysis-and-observational-methods-for-the-behavioral-sciences/E74148FC98DEFA56367A2DF32759AF4D",
        "relationship": "Further reading",
        "access": "abstract",
        "verificationNote": "Publisher description only; chapters not read."
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "KHzwP0eMwTk": {
    "id": "KHzwP0eMwTk",
    "purpose": "Use this lecture to see how event logs become session-level sequences and how support, confidence, lift, gap rules, and minimum support shape which patterns are reported.",
    "distinction": "Support describes how often a sequence occurs across sessions; confidence and lift add conditional and baseline comparisons.",
    "caution": "The lecture notes that frequent patterns describe what happened and not why, and its group differences come from synthetic data used for illustration.",
    "koSummary": "이 강의는 이벤트 로그를 세션 단위의 순서 있는 시퀀스로 바꾸고, 지지도, 신뢰도, 향상도로 반복되는 패턴을 세는 순차 패턴 마이닝을 설명합니다. 간격 규칙과 최소 지지도는 분석자의 선택이므로 반드시 보고해야 하며, 빈번한 패턴은 무슨 일이 있었는지만 보여 줄 뿐 이유를 설명하지는 않는다고 강조합니다.",
    "sources": [
      {
        "title": "Mining sequential patterns",
        "authors": "Rakesh Agrawal and Ramakrishnan Srikant",
        "year": 1995,
        "url": "https://ieeexplore.ieee.org/document/380415/",
        "relationship": "Further reading",
        "access": "abstract",
        "verificationNote": "Abstract only."
      },
      {
        "title": "arulesSequences: Mining Frequent Sequences (reference manual, cspade)",
        "authors": "arulesSequences package authors (CRAN documentation)",
        "year": null,
        "url": "https://cran.r-project.org/web/packages/arulesSequences/refman/arulesSequences.html",
        "relationship": "Further reading",
        "access": "official documentation",
        "verificationNote": "Only the cspade description excerpt checked."
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "dqrWUnItTi4": {
    "id": "dqrWUnItTi4",
    "purpose": "Use this lecture to understand transition network analysis as a first-order Markov model whose edge weights, centrality, bootstrapped stability, and permutation tests must be reported with the counting procedure.",
    "distinction": "The lecture represents lag-one transition probabilities as a network, whereas its lag sequential analysis example compares observed counts with an independence baseline.",
    "caution": "The edge stability and group differences shown come from synthetic data, and a stable edge supports reliability of the estimate and not an explanation of why learners behave that way.",
    "koSummary": "이 강의는 지연 1 전이 횟수를 행별 확률로 바꾸어 네트워크로 나타내는 전이 네트워크 분석(TNA)을 설명합니다. 1차 마르코프 가정, 중심성, 세션 부트스트랩으로 본 간선 안정성, 집단 간 순열검정을 어떻게 보고해야 하는지 안내합니다.",
    "sources": [
      {
        "title": "tna: An R Package for Transition Network Analysis",
        "authors": "Santtu Tikka, Sonsoles López-Pernas, and Mohammed Saqr",
        "year": 2025,
        "url": "https://journals.sagepub.com/doi/10.1177/01466216251348840",
        "relationship": "Further reading",
        "access": "abstract",
        "verificationNote": "Abstract and partial excerpt only."
      },
      {
        "title": "Mapping Relational Dynamics with Transition Network Analysis: A Primer and Tutorial",
        "authors": "Mohammed Saqr, Sonsoles López-Pernas, and Santtu Tikka",
        "year": 2025,
        "url": "https://lamethods.org/book2/chapters/ch15-tna/ch15-tna.html",
        "relationship": "Further reading",
        "access": "Full text available · excerpt checked",
        "verificationNote": "Full text is openly available; reviewed via search excerpt only, thresholds not checked."
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "V5HiWnlkp5E": {
    "id": "V5HiWnlkp5E",
    "purpose": "Use this lecture to learn how ordered network analysis uses a moving look-back window to build directed, normalized session networks that can be compared by connection structure.",
    "distinction": "ONA emphasizes directed connections between coded ideas; the resulting network also depends on the chosen conversational windows and normalization.",
    "caution": "The very large effect in the lecture comes from synthetic groups built to differ, so real coded data will rarely look so clean and the window length changes the network.",
    "koSummary": "이 강의는 이동 창을 이용해 시간 순서가 있는 코드를 방향성 있는 연결로 바꾸는 순서 네트워크 분석(ONA)을 설명합니다. 영상 예시는 세션별 정규화로 연결 구조에 초점을 맞추며, 창 크기와 정규화 및 검정 방법이 결과에 영향을 줄 수 있음을 함께 살펴보세요.",
    "sources": [
      {
        "title": "Epistemic Network Analysis and Ordered Network Analysis in Learning Analytics",
        "authors": "Yuanru Tan, Zachari Swiecki, Andrew R. Ruis, and David Williamson Shaffer",
        "year": 2024,
        "url": "https://link.springer.com/chapter/10.1007/978-3-031-54464-4_18",
        "relationship": "Further reading",
        "access": "abstract",
        "verificationNote": "Abstract and short excerpts only."
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "r_tqNkORPeo": {
    "id": "r_tqNkORPeo",
    "purpose": "Use this lecture to see how a hidden Markov model links observed codes to unobserved states through initial, transition, and emission probabilities, and how the number of states is chosen and checked.",
    "distinction": "A hidden state is a modeling construct that explains patterns in observed codes, not a directly observed or confirmed mental state.",
    "caution": "Recovering structure from simulated sequences is not evidence that inferred states correspond to learners’ mental processes.",
    "koSummary": "이 강의는 관찰된 코드 아래에 보이지 않는 상태가 있다고 가정하고 초기, 전이, 방출 확률로 이를 설명하는 은닉 마르코프 모형(HMM)을 소개합니다. 상태 수를 BIC로 고르고 재시작 결과를 확인해야 하며, 시뮬레이션 데이터에서 복원된 상태는 사람의 사고 방식에 대한 발견이 아니라고 주의를 줍니다.",
    "sources": [
      {
        "title": "Mixture Hidden Markov Models for Sequence Data: The seqHMM Package in R",
        "authors": "Satu Helske and Jouni Helske",
        "year": 2019,
        "url": "https://cran.r-project.org/web/packages/seqHMM/vignettes/seqHMM.pdf",
        "relationship": "Further reading",
        "access": "Full text available · excerpt checked",
        "verificationNote": "Full text (CRAN vignette) openly available; reviewed via excerpt only."
      },
      {
        "title": "seqHMM reference manual (estimation and model fitting)",
        "authors": "seqHMM package authors (CRAN documentation)",
        "year": null,
        "url": "https://cran.r-project.org/web/packages/seqHMM/refman/seqHMM.html",
        "relationship": "Further reading",
        "access": "official documentation",
        "verificationNote": "Official documentation; reviewed via excerpt only."
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "A0xi0-qjIMA": {
    "id": "A0xi0-qjIMA",
    "purpose": "Frames network meta-analysis as a way to compare several treatments by combining direct and indirect evidence.",
    "distinction": "Separates estimated relative effects from treatment rankings, which can hide overlapping uncertainty.",
    "caution": "Validity depends on transitivity and consistency, so check both before trusting any ranking.",
    "koSummary": "네트워크 메타분석이 직접 증거와 간접 증거를 결합해 여러 처치를 비교하는 방법임을 설명합니다. 순위는 불확실성을 가릴 수 있으므로 전이성과 일관성을 먼저 점검해야 합니다.",
    "sources": [
      {
        "title": "Chapter 11: Undertaking network meta-analyses. In Cochrane Handbook for Systematic Reviews of Interventions, version 6.5",
        "authors": "Chaimani A, Caldwell DM, Li T, Higgins JPT, Salanti G",
        "year": 2024,
        "url": "https://training.cochrane.org/handbook/current/chapter-11",
        "relationship": "Further reading",
        "access": "official documentation"
      },
      {
        "title": "Chapter 10: Analysing data and undertaking meta-analyses. In Cochrane Handbook for Systematic Reviews of Interventions, version 6.5",
        "authors": "Deeks JJ, Higgins JPT, Altman DG, McKenzie JE, Veroniki AA (on behalf of the Cochrane Statistical Methods Group)",
        "year": 2024,
        "url": "https://training.cochrane.org/handbook/current/chapter-10",
        "relationship": "Further reading",
        "access": "official documentation"
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "xrfvYZc6XIY": {
    "id": "xrfvYZc6XIY",
    "purpose": "Shows how a Bayesian random-effects model yields posterior probabilities and credible intervals instead of only a p value.",
    "distinction": "A credible interval summarizes posterior probability under the specified model and priors; a confidence interval has a repeated-sampling interpretation.",
    "caution": "With few studies the prior for between-study spread can shift results, so report prior sensitivity.",
    "koSummary": "베이지안 랜덤효과 메타분석에서 사전분포와 우도가 사후분포로 이어지는 과정을 보여 줍니다. 연구 수가 적을 때는 사전분포에 따라 결과가 달라질 수 있어 민감도 분석을 함께 보고해야 합니다.",
    "sources": [
      {
        "title": "A re-evaluation of random-effects meta-analysis",
        "authors": "Higgins JPT, Thompson SG, Spiegelhalter DJ",
        "year": 2009,
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2667312/",
        "relationship": "Further reading",
        "access": "full text",
        "verificationNote": "Relevant passages checked; not an exhaustive full-text claim audit."
      },
      {
        "title": "Chapter 10: Analysing data and undertaking meta-analyses. In Cochrane Handbook for Systematic Reviews of Interventions, version 6.5",
        "authors": "Deeks JJ, Higgins JPT, Altman DG, McKenzie JE, Veroniki AA (on behalf of the Cochrane Statistical Methods Group)",
        "year": 2024,
        "url": "https://training.cochrane.org/handbook/current/chapter-10",
        "relationship": "Further reading",
        "access": "official documentation"
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "s0HYoN8dfIM": {
    "id": "s0HYoN8dfIM",
    "purpose": "Introduces effect sizes as a common scale so studies with different measures can be combined.",
    "distinction": "Separates Hedges small-sample bias correction (g) from random sampling uncertainty.",
    "caution": "Interpret an effect size in its context rather than relying on fixed small, medium, or large labels.",
    "koSummary": "서로 다른 검사를 쓴 연구들을 합치기 위해 표준화된 효과크기를 공통 척도로 쓰는 방법을 설명합니다. 효과크기는 고정된 기준표보다 맥락 속에서 해석해야 합니다.",
    "sources": [
      {
        "title": "Chapter 6: Choosing effect measures and computing estimates of effect. In Cochrane Handbook for Systematic Reviews of Interventions, version 6.5",
        "authors": "Higgins JPT, Li T, Deeks JJ",
        "year": 2024,
        "url": "https://training.cochrane.org/handbook/current/chapter-06",
        "relationship": "Further reading",
        "access": "official documentation"
      },
      {
        "title": "Chapter 10: Analysing data and undertaking meta-analyses. In Cochrane Handbook for Systematic Reviews of Interventions, version 6.5",
        "authors": "Deeks JJ, Higgins JPT, Altman DG, McKenzie JE, Veroniki AA (on behalf of the Cochrane Statistical Methods Group)",
        "year": 2024,
        "url": "https://training.cochrane.org/handbook/current/chapter-10",
        "relationship": "Further reading",
        "access": "official documentation"
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "spTunL0povM": {
    "id": "spTunL0povM",
    "purpose": "Explains inverse-variance weighting and how fixed-effect and random-effects models combine study results.",
    "distinction": "Contrasts one common true effect with true effects that vary across studies around an average.",
    "caution": "A pooled mean alone can conceal variation; examine heterogeneity and, when estimable, a prediction interval.",
    "koSummary": "역분산 가중치로 연구를 합치는 방법과 고정효과 및 랜덤효과 모형의 차이를 설명합니다. 합산 추정치와 함께 이질성을 살펴보고, 추정 가능한 경우 예측구간도 검토하세요.",
    "sources": [
      {
        "title": "Chapter 10: Analysing data and undertaking meta-analyses. In Cochrane Handbook for Systematic Reviews of Interventions, version 6.5",
        "authors": "Deeks JJ, Higgins JPT, Altman DG, McKenzie JE, Veroniki AA (on behalf of the Cochrane Statistical Methods Group)",
        "year": 2024,
        "url": "https://training.cochrane.org/handbook/current/chapter-10",
        "relationship": "Further reading",
        "access": "official documentation"
      },
      {
        "title": "A re-evaluation of random-effects meta-analysis",
        "authors": "Higgins JPT, Thompson SG, Spiegelhalter DJ",
        "year": 2009,
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2667312/",
        "relationship": "Further reading",
        "access": "full text",
        "verificationNote": "Relevant passages checked; not an exhaustive full-text claim audit."
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "9gPGEZsnIPg": {
    "id": "9gPGEZsnIPg",
    "purpose": "Asks why study results differ and whether some results may be missing, using moderators and funnel plots.",
    "distinction": "Separates explaining heterogeneity with a moderator from checking for missing studies.",
    "caution": "Funnel plot asymmetry has more than one cause, and moderator findings are associations rather than proof of cause.",
    "koSummary": "연구 결과가 왜 다른지와 빠진 연구가 있는지를 조절변수 분석과 깔때기 그림으로 살펴봅니다. 비대칭에는 여러 원인이 있고 조절변수 결과는 인과의 증거가 아니라 연관성입니다.",
    "sources": [
      {
        "title": "Chapter 13: Assessing risk of bias due to missing evidence in a meta-analysis. In Cochrane Handbook for Systematic Reviews of Interventions, version 6.5",
        "authors": "Page MJ, Higgins JPT, Sterne JAC",
        "year": 2024,
        "url": "https://training.cochrane.org/handbook/current/chapter-13",
        "relationship": "Further reading",
        "access": "official documentation"
      },
      {
        "title": "Chapter 10: Analysing data and undertaking meta-analyses. In Cochrane Handbook for Systematic Reviews of Interventions, version 6.5",
        "authors": "Deeks JJ, Higgins JPT, Altman DG, McKenzie JE, Veroniki AA (on behalf of the Cochrane Statistical Methods Group)",
        "year": 2024,
        "url": "https://training.cochrane.org/handbook/current/chapter-10",
        "relationship": "Further reading",
        "access": "official documentation"
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "k9izMqIyRXw": {
    "id": "k9izMqIyRXw",
    "purpose": "Shows with rectangles that the area under y = x^2/2 from 0 to 3 approaches the integral 4.5 as slices get thinner.",
    "distinction": "This is a calculus integral demonstration of area under a curve, not an ROC or diagnostic AUC.",
    "caution": "The demo gives an intuition for Riemann sums and does not cover formal limits or integration rules.",
    "koSummary": "y = x^2/2 아래 0에서 3까지의 넓이를 얇은 직사각형으로 근사하면 적분값 4.5에 가까워짐을 보여 줍니다. ROC 곡선의 AUC가 아니라 미적분의 곡선 아래 넓이를 다룹니다.",
    "sources": [
      {
        "title": "Calculus Volume 1",
        "authors": "Gilbert Strang and Edwin \"Jed\" Herman (senior contributing authors), OpenStax",
        "year": 2016,
        "url": "https://openstax.org/books/calculus-volume-1/pages/5-1-approximating-areas",
        "relationship": "Further reading",
        "access": "full text",
        "verificationNote": "Relevant passages checked; not an exhaustive full-text claim audit."
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "iEc8Dt3ePWo": {
    "id": "iEc8Dt3ePWo",
    "purpose": "Helps you separate adaptation inside a task from adaptation between tasks, using VanLehn's inner and outer loops as a shared vocabulary.",
    "distinction": "Micro adaptation responds to steps within a task, while macro adaptation uses a learner model to choose the next task, and a real system can contain both.",
    "caution": "The 2,000-player Launch Lab results come from an illustrative simulation with stated rules, so they show how the loops can interact and are not empirical findings.",
    "koSummary": "과제 안에서 일어나는 미시 적응과 과제 사이에서 일어나는 거시 적응을 구분하고, 두 루프가 어떤 근거를 쓰는지 점검하게 돕는 안내입니다. 영상의 시뮬레이션 수치는 가상의 예시라는 점을 유의하세요.",
    "sources": [
      {
        "title": "The Behavior of Tutoring Systems",
        "authors": "Kurt VanLehn",
        "year": 2006,
        "url": "https://dl.acm.org/doi/10.5555/1435351.1435353",
        "relationship": "Further reading",
        "access": "abstract"
      },
      {
        "title": "Toward a taxonomy of adaptivity for learning",
        "authors": "Jan L. Plass and Shashank Pawar",
        "year": 2020,
        "url": "https://doi.org/10.1080/15391523.2020.1719943",
        "relationship": "Further reading",
        "access": "abstract"
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "SfIj7mrAHwI": {
    "id": "SfIj7mrAHwI",
    "purpose": "Shows how to write a design's hidden hypotheses as testable arrows in Sandoval's conjecture map.",
    "distinction": "Design conjectures link the embodiment to mediating processes, while theoretical conjectures link those processes to outcomes.",
    "caution": "The Recipe Remix lesson and its quiz and video evidence are invented teaching examples, not data from a real classroom.",
    "koSummary": "추측 지도는 설계가 담고 있는 가설을 설계 추측과 이론적 추측이라는 두 종류의 화살표로 적어 검증하게 해 줍니다. Recipe Remix 사례는 설명을 위한 가상의 예시입니다.",
    "sources": [
      {
        "title": "Conjecture Mapping: An Approach to Systematic Educational Design Research",
        "authors": "William Sandoval",
        "year": 2014,
        "url": "https://doi.org/10.1080/10508406.2013.778204",
        "relationship": "Further reading",
        "access": "abstract"
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "GTUT49cgqQE": {
    "id": "GTUT49cgqQE",
    "purpose": "Explains why a design's results vary across classrooms and why scale involves more than the number of schools reached.",
    "distinction": "Implementation research asks which components are core and how enactment varies, and Coburn's view of scale adds depth, sustainability, spread, and shift in ownership.",
    "caution": "The ten-class gains are a toy example, and the link between enacting the core and larger gains is an association, not proof of cause.",
    "koSummary": "설계를 확산할 때는 평균으로 덮지 말고 핵심 요소와 실행의 변이를 연구해야 한다는 점을 정리합니다. 영상의 열 개 학급 수치는 가상 예시이며, 핵심 실행과 성과의 관계는 연관일 뿐입니다.",
    "sources": [
      {
        "title": "Organizing Research and Development at the Intersection of Learning, Implementation, and Design",
        "authors": "William R. Penuel, Barry J. Fishman, Britte Haugan Cheng, and Nora Sabelli",
        "year": 2011,
        "url": "https://doi.org/10.3102/0013189X11421826",
        "relationship": "Further reading",
        "access": "abstract"
      },
      {
        "title": "Rethinking Scale: Moving Beyond Numbers to Deep and Lasting Change",
        "authors": "Cynthia E. Coburn",
        "year": 2003,
        "url": "https://doi.org/10.3102/0013189X032006003",
        "relationship": "Further reading",
        "access": "abstract"
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "Cn2KU6ooubI": {
    "id": "Cn2KU6ooubI",
    "purpose": "Helps you report how much decision power partners actually held in a design project.",
    "distinction": "Both labels can involve designing with participants; examine who sets goals and makes decisions rather than relying on the label alone.",
    "caution": "The AI writing-feedback tool scenarios are illustrations, and a project's label alone does not show where its partners stood, so judge by what the authors report.",
    "koSummary": "공동설계와 참여적 설계를 이름보다 누가 목표와 결정권을 갖는지로 구분해 보게 하는 안내입니다. 두 전통은 겹치므로 연구자가 실제로 보고한 내용을 근거로 참여 수준을 판단하세요.",
    "sources": [
      {
        "title": "The role of children in the design of new technology",
        "authors": "Allison Druin",
        "year": 2002,
        "url": "https://doi.org/10.1080/01449290110108659",
        "relationship": "Further reading",
        "access": "Publisher metadata · earlier report available",
        "venue": "Behaviour & Information Technology, 21(1), 1-25 (Taylor & Francis)",
        "supplementalUrl": "https://drum.lib.umd.edu/items/54383941-c0fb-453d-b66e-e286f5888717",
        "supplementalNote": "Author's university repository (UMD DRUM, HCIL Technical Report 99-23 / CS-TR-4058, 1999). Earlier version of the article; explicitly lists the four roles. Cite the 2002 journal article and note roles were read in this earlier report.",
        "verificationNote": "Four roles (user, tester, informant, design partner) read verbatim in the author's UMD repository tech report (earlier version); the T&F publisher page was reachable only as metadata, so published-version wording is not confirmed."
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "pR--9zWzm30": {
    "id": "pR--9zWzm30",
    "purpose": "Clarifies how the learning sciences and the science of learning grew from different communities and ask different kinds of questions.",
    "distinction": "The science of learning leans on controlled studies of general principles, the learning sciences leans on designs studied in context, and the two increasingly inform each other.",
    "caution": "These are tendencies in emphasis and not a strict divide, so judge each claim by its own evidence and by what the other tradition would still want to see.",
    "koSummary": "학습과학(learning sciences)과 학습의 과학(science of learning)은 출신과 질문이 다르지만 점점 서로를 보완한다는 점을 설명합니다. 두 전통을 엄격한 이분법으로 보지 말고 각 주장의 근거를 따져 보세요.",
    "sources": [
      {
        "title": "Foundations for a New Science of Learning",
        "authors": "Andrew N. Meltzoff, Patricia K. Kuhl, Javier Movellan, and Terrence J. Sejnowski",
        "year": 2009,
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2776823",
        "relationship": "Further reading",
        "access": "full text",
        "verificationNote": "Relevant passages checked; not an exhaustive full-text claim audit."
      },
      {
        "title": "About ISLS (International Society of the Learning Sciences)",
        "authors": "International Society of the Learning Sciences",
        "year": null,
        "url": "https://www.isls.org/about",
        "access": "official society page",
        "relationship": "Further reading"
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "NdaVj7XmiEU": {
    "id": "NdaVj7XmiEU",
    "purpose": "Walks through a design-based research project from problem grounding to reporting so you can plan a conjecture and a design log.",
    "distinction": "Design-based research blends empirical study with theory-driven design, and the five stages and macro and mini cycles in the lecture are one teaching framing rather than the only accepted sequence.",
    "caution": "The AI feedback tool in a first-year writing course is a running example, so its findings are illustrative and not reported results.",
    "koSummary": "설계기반연구를 문제 정립에서 보고까지 단계별로 따라가며 추측, 설계 일지, 신뢰할 만한 보고서의 조건을 생각해 보게 합니다. 이 단계 구분은 하나의 교육용 틀이며, 영상의 사례 결과는 예시입니다.",
    "sources": [
      {
        "title": "Design-Based Research: An Emerging Paradigm for Educational Inquiry",
        "authors": "The Design-Based Research Collective",
        "year": 2003,
        "url": "https://doi.org/10.3102/0013189X032001005",
        "relationship": "Further reading",
        "access": "abstract"
      },
      {
        "title": "Conducting Educational Design Research (2nd ed.)",
        "authors": "Susan McKenney and Thomas C. Reeves",
        "year": 2018,
        "url": "https://doi.org/10.4324/9781315105642",
        "relationship": "Further reading",
        "access": "abstract"
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "XN29cK9FYMY": {
    "id": "XN29cK9FYMY",
    "purpose": "Helps you choose a design-research frame by deciding what your main contribution will be.",
    "distinction": "The three frames share iteration, real settings, and design as inquiry, and they differ mainly in emphasis on learning theory, a working solution with principles, or design models and tools.",
    "caution": "The labels overlap in practice and many studies draw on more than one, so treat the lecture's three-way choice as a heuristic and not a rule.",
    "koSummary": "설계기반연구, 교육적 설계연구, 설계개발연구는 반복, 실제 현장, 탐구로서의 설계를 공유하고 주된 기여의 강조점이 다릅니다. 세 틀은 겹치므로 영상의 구분은 선택을 돕는 어림 기준으로만 쓰세요.",
    "sources": [
      {
        "title": "Conducting Educational Design Research (2nd ed.)",
        "authors": "Susan McKenney and Thomas C. Reeves",
        "year": 2018,
        "url": "https://doi.org/10.4324/9781315105642",
        "relationship": "Further reading",
        "access": "abstract"
      },
      {
        "title": "Design and Development Research: Methods, Strategies, and Issues",
        "authors": "Rita C. Richey and James D. Klein",
        "year": 2007,
        "url": "https://doi.org/10.4324/9780203826034",
        "relationship": "Further reading",
        "access": "abstract"
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "aADMw1NjWKU": {
    "id": "aADMw1NjWKU",
    "purpose": "Introduces Malone's challenge, fantasy, and curiosity framework and the intrinsic versus extrinsic fantasy distinction for designing learning games.",
    "distinction": "Intrinsic fantasy depends on the skill being learned, while extrinsic fantasy is attached to the content and works whether or not the skill is used.",
    "caution": "Motivation and time on task are not the same as learning, and the video itself calls intrinsic integration a design hypothesis because later studies are mixed.",
    "koSummary": "이 영상은 말론이 챌린지, 판타지, 호기심을 재미있는 학습의 세 요소로 정리했고, 학습 기술과 직접 연결된 내재적 판타지가 더 흥미롭고 교육적이라고 주장했다고 설명합니다. 다만 후속 연구 결과는 엇갈리므로 내재적 통합은 보장이 아니라 설계 가설로 다루어야 한다고 강조합니다.",
    "sources": [
      {
        "title": "Toward a theory of intrinsically motivating instruction",
        "authors": "Thomas W. Malone",
        "year": 1981,
        "url": "https://doi.org/10.1207/s15516709cog0504_2",
        "relationship": "Further reading",
        "access": "abstract"
      },
      {
        "title": "Motivating children to learn effectively: Exploring the value of intrinsic integration in educational games",
        "authors": "M. P. Jacob Habgood and Shaaron E. Ainsworth",
        "year": 2011,
        "url": "https://eric.ed.gov/?id=EJ922627",
        "relationship": "Further reading",
        "access": "abstract"
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "GcsN8Ozqvec": {
    "id": "GcsN8Ozqvec",
    "purpose": "Contrasts Malone's features of fun activities with Keller's audience-driven ARCS process for diagnosing and fixing motivation problems.",
    "distinction": "ARCS organizes motivational design around attention, relevance, confidence, and satisfaction, while Malone examines intrinsically motivating features of activities.",
    "caution": "The fractions audit is a toy illustration, and motivation ratings or reported effect sizes should not be read as evidence that learning improved in a given lesson.",
    "koSummary": "이 영상은 말론의 이론이 재미를 만드는 요소를 알려주고, 켈러의 ARCS는 학습자 집단에서 어떤 동기 요소가 부족한지 진단하는 절차라고 비교합니다. 그래서 ARCS로 먼저 진단하고 말론의 요소로 보완하되, 판타지는 학습 기술과 연결해야 한다고 정리합니다.",
    "sources": [
      {
        "title": "First principles of motivation to learn and e3-learning",
        "authors": "John M. Keller",
        "year": 2008,
        "url": "https://doi.org/10.1080/01587910802154970",
        "relationship": "Further reading",
        "access": "abstract"
      },
      {
        "title": "Toward a theory of intrinsically motivating instruction",
        "authors": "Thomas W. Malone",
        "year": 1981,
        "url": "https://doi.org/10.1207/s15516709cog0504_2",
        "relationship": "Further reading",
        "access": "abstract"
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "Navj1yDN5-Q": {
    "id": "Navj1yDN5-Q",
    "purpose": "Separates felt presence from learning outcomes and cognitive load using a desktop versus VR science lab experiment.",
    "distinction": "In the studies discussed, presence ratings, test-based learning outcomes, and cognitive-load measures capture different aspects of the experience.",
    "caution": "One study of 52 university students shows that higher presence can coincide with lower learning, not that VR always harms learning.",
    "koSummary": "이 영상은 마크란스키 연구에서 VR 학습자가 더 큰 현장감을 느꼈지만 학습 점수는 낮았고 EEG 기반 인지 부하는 높았다고 설명합니다. 몰입감만으로 학습 효과를 판단할 수 없으며, 과제와 교수설계 및 평가 방식도 함께 보아야 합니다.",
    "sources": [
      {
        "title": "Adding immersive virtual reality to a science lab simulation causes more presence but less learning",
        "authors": "Guido Makransky, Thomas S. Terkildsen, and Richard E. Mayer",
        "year": 2019,
        "url": "https://doi.org/10.1016/j.learninstruc.2017.12.007",
        "relationship": "Further reading",
        "access": "abstract"
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "LKY8wo6KoDw": {
    "id": "LKY8wo6KoDw",
    "purpose": "Shows how a Bayesian network can turn Launch Lab evidence into updated beliefs about player skills and drive adaptive decisions.",
    "distinction": "Network outputs are modeled beliefs given assumed tables and a Q matrix, not validated measures of a learner's actual proficiency.",
    "caution": "The probabilities in the video are illustrative or simulated, and the video itself says to validate the Q matrix, use real pilot data, compare with outside measures, and check fairness before trusting them.",
    "koSummary": "이 영상은 Q행렬과 증거 규칙을 베이지안 네트워크에 연결해 각 플레이어의 기술에 대한 믿음이 레벨마다 갱신되는 과정을 보여줍니다. 이 수치는 모델이 계산한 믿음일 뿐이며, 실제 사용 전에 Q행렬 검증, 실제 데이터 추정, 외부 측정 비교, 공정성 점검이 필요하다고 말합니다.",
    "sources": [
      {
        "title": "A brief introduction to evidence-centered design (CSE Report 632)",
        "authors": "Robert J. Mislevy, Russell G. Almond, and Janice F. Lukas",
        "year": 2004,
        "url": "https://files.eric.ed.gov/fulltext/ED483399.pdf",
        "relationship": "Further reading",
        "access": "full text",
        "verificationNote": "Relevant passages checked; not an exhaustive full-text claim audit."
      },
      {
        "title": "Lessons learned and best practices of stealth assessment",
        "authors": "Lubin Wang, Valerie Shute, and Gregory R. Moore",
        "year": 2015,
        "url": "https://myweb.fsu.edu/vshute/pdf/IJGCMS.PDF",
        "relationship": "Further reading",
        "access": "full text",
        "venue": "International Journal of Gaming and Computer-Mediated Simulations, 7(4), 66-87, DOI 10.4018/IJGCMS.2015100104",
        "verificationNote": "Relevant passages checked; not an exhaustive full-text claim audit."
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "XC_5YE2YYoY": {
    "id": "XC_5YE2YYoY",
    "purpose": "Introduces evidence-centered design for game-based assessment, linking claims, tasks, observable evidence, and a Q matrix in the Launch Lab example.",
    "distinction": "Logging clicks is only data capture, while assessment requires evidence rules that connect observed actions to specific claims about skills.",
    "caution": "A Q matrix is itself a claim that needs justification, so marking cells without a reason makes a diagnosis look more precise than it is.",
    "koSummary": "이 영상은 같은 점수를 받은 두 플레이어도 변인을 하나씩 바꿨는지에 따라 다른 증거를 보여준다는 예로 증거 중심 설계를 소개합니다. 역량, 증거, 과제 모델과 Q행렬이 주장과 관찰 가능한 행동을 잇는 논증이며, 증거 규칙이 있어야 로그가 평가가 된다고 설명합니다.",
    "sources": [
      {
        "title": "A brief introduction to evidence-centered design (CSE Report 632)",
        "authors": "Robert J. Mislevy, Russell G. Almond, and Janice F. Lukas",
        "year": 2004,
        "url": "https://files.eric.ed.gov/fulltext/ED483399.pdf",
        "relationship": "Further reading",
        "access": "full text",
        "verificationNote": "Relevant passages checked; not an exhaustive full-text claim audit."
      },
      {
        "title": "Lessons learned and best practices of stealth assessment",
        "authors": "Lubin Wang, Valerie Shute, and Gregory R. Moore",
        "year": 2015,
        "url": "https://myweb.fsu.edu/vshute/pdf/IJGCMS.PDF",
        "relationship": "Further reading",
        "access": "full text",
        "verificationNote": "Relevant passages checked; not an exhaustive full-text claim audit."
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "Poo-UGoTyhw": {
    "id": "Poo-UGoTyhw",
    "purpose": "Summarizes Mayer's cognitive theory of multimedia learning and groups design principles by the type of processing they target.",
    "distinction": "Extraneous processing does not serve the learning goal, essential processing represents the material, and generative processing organizes and integrates it.",
    "caution": "The video applies its principles to its own design and notes that its synthetic narration is an open question under the voice principle, so it is not evidence about learning from this video.",
    "koSummary": "이 영상은 이중 채널, 제한된 용량, 능동적 학습이라는 세 가정에 바탕해 메이어가 불필요한 처리, 핵심 처리, 생성적 처리를 구분했다고 설명합니다. 각 처리에 맞춰 군더더기 제거, 학습자 속도 분절, 대화체와 안내자 활용 같은 설계 원칙을 정리합니다.",
    "sources": [
      {
        "title": "The past, present, and future of the cognitive theory of multimedia learning",
        "authors": "Richard E. Mayer",
        "year": 2024,
        "url": "https://doi.org/10.1007/s10648-023-09842-1",
        "relationship": "Further reading",
        "access": "full text",
        "verificationNote": "Full text (open access) read for the three-processing passage."
      }
    ],
    "reviewedAt": "2026-10-16"
  },
  "es-10-question-frameworks": {
    "id": "es-10-question-frameworks",
    "purpose": "Use this lecture to choose a question framework by the kind of question and to decide which elements are searched and which are only screened.",
    "distinction": "PICO suits Maya's effects question and SPIDER suits Omar's experience question, and every element kept becomes an eligibility clause while only the elements authors reliably name become search blocks.",
    "caution": "The Methley and colleagues comparison covers one health topic with differing numbers of search blocks, so it does not show which framework searches best for education questions.",
    "koSummary": "이 강의는 질문의 종류에 따라 PICO, SPIDER 등 질문 프레임워크를 고르는 방법을 Maya와 Omar의 가상 사례로 설명합니다. 유지한 요소는 모두 선정 기준이 되지만, 저자들이 일관되게 쓰는 요소만 검색 블록으로 삼으라고 강조합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-01-review-families": {
    "id": "es-01-review-families",
    "purpose": "Use this lecture to name a review's family from its purpose sentence and Grant and Booth's four processes instead of from its title.",
    "distinction": "Systematic, scoping, narrative, integrative, and qualitative meta-synthesis reviews differ in search, appraisal, synthesis, and analysis, and a narrative review is not automatically second rate.",
    "caution": "The made-up review that fits only one of four rows is a teaching example, and the lecture notes that families overlap, so the row check is a judgment aid and not a fixed classification test.",
    "koSummary": "이 강의는 리뷰의 제목이 아니라 목적 문장과 Grant와 Booth의 네 가지 과정(검색, 평가, 종합, 분석)으로 리뷰 유형을 판별합니다. 가상의 사례에서 Maya는 체계적 리뷰라는 이름이 붙은 글을 서술적 리뷰로 판단하며, 문제는 사용하지 않은 방법을 주장하는 것이라고 말합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-08-six-ways-to-synthesize": {
    "id": "es-08-six-ways-to-synthesize",
    "purpose": "Use this lecture to see how six kinds of synthesis treat the same pile of studies and to judge which one fits.",
    "distinction": "Narrative, scoping, systematic, and integrative reviews are applied directly, while meta-analysis and network meta-analysis appear only as concepts, with a seesaw for weighted pooling and a common comparator for indirect comparison.",
    "caution": "The twelve studies are made up, and the lecture itself says pooling needs comparable studies, indirect routes are usually weaker than a direct trial and rest on transitivity, and the statistics need training beyond this series.",
    "koSummary": "이 강의는 가상의 연구 12편을 서술적, 범위, 체계적, 통합적 리뷰와 메타분석, 네트워크 메타분석이라는 여섯 방식으로 종합해 봅니다. 통계적 방법은 개념 수준으로만 다루며, 비교 가능한 연구가 필요하고 간접 비교는 보통 직접 시험보다 약하다고 주의를 줍니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-03-criteria-on-trial": {
    "id": "es-03-criteria-on-trial",
    "purpose": "Use this lecture to turn a vague eligibility criterion into operational clauses and test it with a partner before screening.",
    "distinction": "A pilot of fourteen made-up records moves Cohen's kappa from 0.29 to 0.85 after a rewrite, and the clause change is logged as coming from the pilot and not from the findings.",
    "caution": "Agreement is not correctness, because the sharper rule led both reviewers to wrongly exclude a plausible study, and the kappa values are illustrative numbers from made-up records.",
    "koSummary": "이 강의는 모호한 선정 기준을 실행 가능한 조항으로 바꾸고 파트너와 시범 적용해 봅니다. 가상의 기록 14건에서 코헨의 카파가 0.29에서 0.85로 오르지만, 일치가 곧 정확성은 아니라는 점도 함께 보여 줍니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-04-search-strings": {
    "id": "es-04-search-strings",
    "purpose": "Use this lecture to treat searching as a method by building concept blocks and weighing known-study recall against the records you must screen.",
    "distinction": "Maya compares four versions of a string, joins terms with OR within a block and AND across blocks, finds the block that let a known study slip, and logs the search with PRISMA-S.",
    "caution": "Finding ten of ten known studies is a check and not proof, since other relevant studies may still be missing, and Maya's counts are illustrative.",
    "koSummary": "이 강의는 Maya가 검색식을 네 번 고쳐 가며 알려진 연구 회수율과 선별할 기록 수를 저울질하는 과정을 보여 줍니다. 개념 블록 구성, 절단 검색, 플랫폼 간 구문 변환, 통제어휘, PRISMA-S 기록을 다루지만, 알려진 연구를 모두 찾았다고 해서 누락이 없다는 증거는 아니라고 경고합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-05-screening-calibration": {
    "id": "es-05-screening-calibration",
    "purpose": "Use this lecture to calibrate two-stage screening on a pilot before counting, then report the table, kappa, and agreement on keeps.",
    "distinction": "Maya and Omar's forty-record pilot yields 75 percent agreement, 56 percent chance agreement, and kappa 0.43, and disagreements are sorted into ambiguity, slips, and judgement, each with its own fix.",
    "caution": "The lecture only loosely recalls earlier work on sharpening the criterion, and its pilot figures and the rare-keeps set (92.5 percent agreement, kappa 0.36) are made-up numbers, with labels like substantial varying by source.",
    "koSummary": "이 강의는 실제 선별 전에 Maya와 Omar가 가상의 기록 40건으로 2단계 선별을 시범 적용하고 일치율, 우연 일치, 카파를 계산하는 과정을 다룹니다. 불일치를 기준의 모호함, 실수, 판단 차이로 나누어 각각 다르게 해결하고, 표와 카파와 보유 기록 일치도를 함께 보고하라고 권합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-06-table-to-claim": {
    "id": "es-06-table-to-claim",
    "purpose": "Use this lecture to build a claim, its evidence, and a boundary from an extraction table by asking which way results point, for whom, and how sure.",
    "distinction": "Counting studies by direction of effect replaces vote counting by significance, and regrouping nine made-up studies by setting and design produces a claim with a stated boundary.",
    "caution": "Direction counting ignores effect size, uncertainty is large with few studies, and this made-up table cannot separate setting from design.",
    "koSummary": "이 강의는 가상의 연구 9편의 추출표에서 결과가 어느 방향인지, 누구에게 해당하는지, 얼마나 확실한지를 물어 주장과 근거, 한계 범위를 만듭니다. 유의성 투표 대신 방향으로 세는 방법을 쓰되 효과 크기를 무시하고 설정과 설계를 구분하지 못한다는 한계를 분명히 합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-09-synthesis-writing": {
    "id": "es-09-synthesis-writing",
    "purpose": "Use this lecture to turn an author-by-author summary into a concept-centric synthesis and keep your own insight in the Discussion.",
    "distinction": "A Webster and Watson concept matrix of five made-up studies shows agreement, a tension, and a pattern linking class discussion to deeper revision, which Maya labels as her own insight.",
    "caution": "No study compared discussion with no discussion, so the pattern is a hypothesis for the Discussion and not a Results finding, and the lecture briefly refers back to Maya's earlier claim without requiring that video.",
    "koSummary": "이 강의는 저자별 요약을 개념 중심 종합으로 바꾸는 방법을 Webster와 Watson의 개념 행렬로 보여 줍니다. 가상의 연구 5편에서 얻은 수업 토론과 깊은 수정의 연관성은 검증되지 않은 가설이므로 결과가 아니라 논의에 두어야 한다고 설명합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-07-prisma-flow-and-tool-audit": {
    "id": "es-07-prisma-flow-and-tool-audit",
    "purpose": "Use this lecture to rebuild a PRISMA 2020 flow diagram from logs and to audit an AI screening assistant before trusting it.",
    "distinction": "The flow separates records, reports, and studies and reconciles an out-of-date draft, and the audit of a made-up assistant on five tests finds one eligible record missed.",
    "caution": "PRISMA says what to report and not how good a review is, and the tool audit is a single made-up assistant, so it illustrates a safe default (sort but never exclude) and not any real tool's accuracy.",
    "koSummary": "이 강의는 Maya의 기록으로 PRISMA 2020 흐름도를 상자별로 다시 만들며 기록, 보고서, 연구를 구분하고 오래된 초안을 정리합니다. 가상의 AI 선별 도구를 다섯 가지 테스트로 점검하여 적격 기록 하나를 놓친 것을 확인하고, 도구는 정렬만 하고 제외는 하지 않는 것을 기본값으로 권합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-02-review-autopsy": {
    "id": "es-02-review-autopsy",
    "purpose": "Use this capstone to audit a review in five moves, with every judgment backed by a quotable sentence or a recomputable number.",
    "distinction": "The made-up scoping review on AI chatbot feedback is checked for family fit against Munn and colleagues' guidance and for protocol, search, screening, and flow against PRISMA 2020, and its flow diagram leaves four studies unaccounted for.",
    "caution": "PRISMA checks what was reported and not how well the work was done, and silence means not reported and not that it was not done, so the audit of one made-up review does not rate real reviews.",
    "koSummary": "이 강의는 가상의 범위 리뷰를 다섯 단계로 감사하는 종합 사례로, 모든 판단에 인용할 문장이나 다시 계산할 수 있는 숫자를 요구합니다. 흐름도에서 연구 4편이 설명되지 않음을 찾아내지만, PRISMA는 보고 여부를 볼 뿐 수행의 질을 보증하지 않으며 침묵은 하지 않았다는 뜻이 아니라고 강조합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-title-is-not-the-family": {
    "id": "es-short-title-is-not-the-family",
    "purpose": "Use this short to see why a review's title does not settle its family.",
    "distinction": "Checking a made-up review labelled systematic against Grant and Booth's four processes finds only one of four rows fits and a purpose that argues a case, so it is a narrative review wearing a systematic label.",
    "caution": "Narrative reviews have their own job, so the problem shown is claiming a method the review did not use and not the narrative form, and the example is made up.",
    "koSummary": "이 짧은 영상은 체계적이라는 이름이 붙은 가상의 리뷰를 Grant와 Booth의 네 과정으로 점검해 제목이 유형을 정하지 않음을 보여 줍니다. 네 행 중 하나만 맞아 서술적 리뷰로 판단하며, 문제는 서술적 리뷰 자체가 아니라 쓰지 않은 방법을 내세우는 것이라고 말합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-choosing-a-review": {
    "id": "es-short-choosing-a-review",
    "purpose": "Use this short to move from a question to a review family and to see why no family is automatically best.",
    "distinction": "Grant and Booth's idea of fitness for purpose guides Maya among systematic, scoping, narrative, qualitative meta-synthesis, and integrative reviews, with meta-analysis and network meta-analysis usually building on a systematic review.",
    "caution": "Scoping still requires rigorous, transparent methods, and the statistical methods are beyond this series, so the short is a map and not a decision rule.",
    "koSummary": "이 짧은 영상은 Maya의 질문에서 출발해 적합한 리뷰 유형을 고르는 길을 안내하며 Grant와 Booth의 목적 적합성을 근거로 어느 유형도 자동으로 최선은 아니라고 말합니다. 범위 리뷰도 엄격하고 투명한 방법이 필요하고, 통계적 방법은 이 시리즈의 범위를 벗어난다고 덧붙입니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-high-agreement-low-kappa": {
    "id": "es-short-high-agreement-low-kappa",
    "purpose": "Use this short to understand why two reviewers can agree often yet show a low kappa.",
    "distinction": "Two made-up reviewers agree on 37 of 40 records (92.5 percent) yet kappa is 0.36 when keeps are rare, while a set with common keeps and the same agreement gives 0.81.",
    "caution": "Kappa is not broken but points at the rare keeps, and these figures come from made-up records, so they show a mechanism and not typical values for real screening.",
    "koSummary": "이 짧은 영상은 가상의 검토자 둘이 40건 중 37건(92.5%)에서 일치해도 보유 기록이 드물면 카파가 0.36에 그치는 이유를 설명합니다. 카파가 고장 난 것이 아니라 드문 보유 기록을 가리키는 것이므로 카파와 표, 보유 및 제외 일치도를 함께 보고하라고 합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-vote-counting": {
    "id": "es-short-vote-counting",
    "purpose": "Use this short to see why counting significant results misleads and what counting by direction offers instead.",
    "distinction": "In nine made-up studies only two are significant but the five smallest all point up, and counting by direction gives seven up and two down, a method SWiM names and Cochrane accepts when effect sizes cannot be combined.",
    "caution": "Direction counting ignores effect size and study size, so it shows which way the evidence leans and is not proof, and the nine studies are made up.",
    "koSummary": "이 짧은 영상은 가상의 연구 9편에서 유의한 결과는 둘뿐이지만 작은 연구 다섯 편이 모두 긍정 방향임을 보여 유의성 세기의 오류를 설명합니다. 방향으로 세면 긍정 7편, 부정 2편이 되지만, 이는 효과 크기를 무시하므로 증거가 기우는 방향일 뿐 증명은 아니라고 주의합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-prisma-is-not-quality": {
    "id": "es-short-prisma-is-not-quality",
    "purpose": "Use this short to separate whether a review was reported from whether it was done well.",
    "distinction": "PRISMA 2020's own statement says it should not be used to assess methodological quality, and a made-up flow diagram with four full texts lacking a path shows what reporting lets a reader check.",
    "caution": "Silence about a protocol does not prove there was none, only that a reader cannot check, so a reporting check alone cannot rate a real review's quality.",
    "koSummary": "이 짧은 영상은 리뷰가 보고되었는지와 잘 수행되었는지를 구분하며, PRISMA 2020 자체가 방법론적 질 평가에 쓰지 말라고 밝힌다는 점을 인용합니다. 가상의 흐름도에서 경로 없는 전문 4편을 찾아내고, 프로토콜 언급이 없다고 해서 없었다는 뜻은 아니며 독자가 확인할 수 없을 뿐이라고 말합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-known-study-recall": {
    "id": "es-short-known-study-recall",
    "purpose": "Use this short to test a search string against studies you already know belong.",
    "distinction": "Maya's broad and tight strings both find ten of ten known studies although one returns almost five times as many records, and the Cochrane Handbook treats this as one simple test.",
    "caution": "A known study only warns you about the words it uses, so ten of ten is not proof of completeness and needs supplementary methods and peer review of the string.",
    "koSummary": "이 짧은 영상은 이미 알고 있는 연구를 기준으로 검색식을 시험하는 알려진 연구 회수율을 설명합니다. Maya의 넓은 검색식과 좁은 검색식은 모두 10편 중 10편을 찾지만 기록 수는 거의 다섯 배 차이가 나며, 이는 하나의 단순한 점검일 뿐 보완 방법과 검색식 동료 검토가 필요하다고 합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-ai-tools-dont-exclude": {
    "id": "es-short-ai-tools-dont-exclude",
    "purpose": "Use this short to see why an AI screening assistant should sort records but not exclude them.",
    "distinction": "A made-up assistant flags five of Maya's six hand-screened includes plus four others, so one included study would have vanished had it excluded, which fits the joint Cochrane and Campbell statement on human oversight and full reporting.",
    "caution": "This is one made-up assistant on forty records, so it shows how a loss can hide in an exclusion count and not how any real tool performs.",
    "koSummary": "이 짧은 영상은 가상의 AI 선별 도구가 Maya가 직접 선별한 40건에서 포함 6건 중 5건과 다른 4건을 표시해, 도구가 제외했다면 포함 연구 하나가 사라졌을 것임을 보여 줍니다. 자동 제외 건수로는 어떤 연구를 잃었는지 알 수 없으므로 도구는 정렬만 하고 제외는 사람이 맡는 것을 기본값으로 권합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-disclosing-ai-use": {
    "id": "es-short-disclosing-ai-use",
    "purpose": "Use this short to build a brief, checkable AI-use disclosure for a review.",
    "distinction": "The disclosure grows from the ICMJE items (which tool, for what purpose, humans responsible, AI not an author) to the joint statement's additions of version, dates, validation, and how output was verified, shown with made-up statements from Maya's drafts.",
    "caution": "Rules differ by venue, so the example statements are not a policy and the journal, funder, or institution policy still has to be checked.",
    "koSummary": "이 짧은 영상은 ICMJE 권고(어떤 도구, 어떤 목적, 책임지는 사람, AI는 저자가 아님)에서 시작해 증거 종합 단체들의 공동 성명이 더하는 버전, 날짜, 검증, 출력 확인 방법까지 AI 사용 공개문을 키워 갑니다. 규정은 곳마다 다르므로 저널, 연구비 지원기관, 소속 기관의 정책을 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-framework-pico": {
    "id": "es-short-framework-pico",
    "purpose": "Use this short to learn what each PICO letter becomes in a review question and which letters get searched.",
    "distinction": "PICO (population, intervention, optional comparison, outcome) comes from Richardson and colleagues' 1995 well-built clinical question, and for Maya's chatbot feedback question every element becomes an eligibility clause while usually only population and intervention become search blocks.",
    "caution": "Cochrane finds PICO generally unsuitable for qualitative questions and calls searching every letter usually unnecessary, so PICO should not be applied by default to every question.",
    "koSummary": "이 짧은 영상은 Richardson 등이 1995년에 제안한 PICO의 각 글자가 Maya의 챗봇 피드백 질문에서 무엇이 되는지 설명합니다. 모든 요소는 선정 기준이 되지만 보통 대상과 중재만 검색 블록이 되며, Cochrane은 질적 질문에 PICO가 대체로 맞지 않는다고 봅니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-framework-picos-picot-picoc": {
    "id": "es-short-framework-picos-picot-picoc",
    "purpose": "Use this short to decide when an extra letter (study design, time, or context) earns its own search block.",
    "distinction": "In one health review, a qualitative design block cut hits from 23,758 to 448 but lost five of eighteen relevant articles.",
    "caution": "That design block was untested in education and T is not a publication date limit, so the one health example does not show that extra letters help or hurt elsewhere.",
    "koSummary": "이 짧은 영상은 PICO에 연구 설계, 시간, 맥락을 더한 PICOS, PICOT, PICOC를 다루며 추가 글자가 검색 블록이 될 가치가 있는 경우를 묻습니다. 한 보건 리뷰에서 질적 설계 블록이 검색 결과를 23,758건에서 448건으로 줄였지만 관련 논문 18편 중 5편을 놓쳤고, 교육 분야에서는 검증되지 않았으며 T는 출판 연도 제한이 아니라고 주의합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-framework-peco-peo": {
    "id": "es-short-framework-peco-peo",
    "purpose": "Use this short to tell an exposure (something people do unassigned) from a PICO intervention.",
    "distinction": "Maya's question on self-initiated chatbot use and writing self-efficacy shows PECO and JBI's PEO, with attention to setting the comparator and stating outcomes non-directionally.",
    "caution": "Both frameworks give association and not proof that something works, so an exposure question cannot support effectiveness claims.",
    "koSummary": "이 짧은 영상은 Maya의 자발적 챗봇 사용과 글쓰기 자기효능감 질문으로, 누군가 배정한 중재와 학생이 스스로 하는 노출을 구분합니다. PECO와 JBI의 PEO, 비교 대상 설정, 결과를 방향 없이 서술하는 법을 다루며, 두 틀은 연관성만 보여 줄 뿐 효과를 증명하지 않는다고 말합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-framework-spider": {
    "id": "es-short-framework-spider",
    "purpose": "Use this short to apply SPIDER to an experience question, as in Omar's question about how students experience chatbot feedback.",
    "distinction": "SPIDER (sample, phenomenon of interest, design, evaluation, research type) from Cooke, Smith, and Booth searches only sample and phenomenon by default, and in Methley and colleagues' comparison it had higher precision but missed five of eighteen relevant studies.",
    "caution": "That comparison covers one health topic, is untested in education, and SPIDER's own authors say it needs more testing, so its precision gain should not be assumed to carry over.",
    "koSummary": "이 짧은 영상은 Cooke, Smith, Booth의 SPIDER(표본, 관심 현상, 설계, 평가, 연구 유형)를 학생이 챗봇 피드백을 어떻게 경험하는지를 묻는 Omar의 질문에 적용합니다. 기본적으로 표본과 현상만 검색하며, Methley 등의 비교에서 정밀도는 높았지만 관련 연구 18편 중 5편을 놓쳤고 한 보건 주제여서 교육에는 검증되지 않았다고 주의합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-framework-pcc-pico": {
    "id": "es-short-framework-pcc-pico",
    "purpose": "Use this short to choose between PCC for a scoping map and PICo for a qualitative question, and to decide whether context is searched.",
    "distinction": "JBI's PCC (population, concept, context) frames Maya's scoping map and PICo (population, phenomenon of interest, context) frames Omar's question, with people and concept searched and context usually screened because abstracts may not name settings consistently.",
    "caution": "The short states that no study was found testing either framework for searching, so the search-or-screen advice rests on reasoning and not on tested performance.",
    "koSummary": "이 짧은 영상은 Maya의 범위 지도에는 JBI의 PCC를, Omar의 질적 질문에는 PICo를 적용합니다. 유지한 요소는 선정 기준이 되고 대상과 개념은 검색하되, 초록이 배경을 일관되게 쓰지 않을 수 있어 맥락은 대개 선별 단계에서 다루며, 두 틀의 검색 성능을 시험한 연구는 찾지 못했다고 밝힙니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-framework-spice-eclipse": {
    "id": "es-short-framework-spice-eclipse",
    "purpose": "Use this short to match SPICE to service questions and ECLIPSE to policy requests and to decide which elements to search.",
    "distinction": "Booth's SPICE (setting, perspective, intervention, comparison, evaluation) is applied to a writing center chatbot and Wildridge and Bell's ECLIPSE to policy requests, with setting and intervention searched and the rest screened.",
    "caution": "Searching setting and intervention is the video's advice and not Booth's rule, and no study was found testing either framework.",
    "koSummary": "이 짧은 영상은 서비스 질문에는 Booth의 SPICE를 글쓰기센터 챗봇 사례로, 정책 요청에는 Wildridge와 Bell의 ECLIPSE를 소개합니다. 환경과 중재를 검색하고 나머지는 선별하라는 것은 Booth의 규칙이 아니라 영상의 제안이며, 두 틀을 시험한 연구는 찾지 못했다고 밝힙니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-framework-cimo": {
    "id": "es-short-framework-cimo",
    "purpose": "Use this short to apply CIMO to how and in-what-circumstances questions, and to read for mechanism instead of searching it.",
    "distinction": "CIMO (context, intervention, mechanism, outcomes) comes from management research, applied to Maya's chatbot feedback proposition, with context and intervention searched, the outcome screened, and the mechanism read for in full texts.",
    "caution": "The short notes that no study was found testing CIMO, so the choice to leave the mechanism out of the search is advice and not demonstrated performance.",
    "koSummary": "이 짧은 영상은 경영학 연구에서 나온 CIMO(맥락, 중재, 기제, 결과)를 어떻게와 어떤 상황에서 질문에 적용하며 Maya의 챗봇 피드백 명제와 성찰 과제를 사용합니다. 맥락과 중재는 검색하고 결과는 선별하며 기제는 검색하지 않고 전문에서 찾아 읽으라고 하고, CIMO를 시험한 연구는 찾지 못했다고 밝힙니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "es-short-framework-perspectif-behemoth": {
    "id": "es-short-framework-perspectif-behemoth",
    "purpose": "Use this short to choose PerSPEcTiF for qualitative reviews of complex interventions or BeHEMoTh for finding theory.",
    "distinction": "Booth's PerSPEcTiF suits questions where context, timing, and whose view counts matter and is not meant to be searched on all seven letters, while BeHEMoTh adds exclusion terms and citation searching when looking for theory.",
    "caution": "Neither framework has been formally evaluated, so they are structured prompts for thinking and not tested search methods.",
    "koSummary": "이 짧은 영상은 맥락, 시점, 누구의 관점인지가 중요한 복합 중재의 질적 리뷰에는 PerSPEcTiF를, 이론 찾기에는 BeHEMoTh를 소개합니다. PerSPEcTiF의 일곱 글자를 모두 검색하는 것은 권하지 않으며 이론을 찾을 때는 제외어와 인용 검색을 더하되, 두 틀 모두 공식 평가를 받은 적이 없다고 합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-who-learns-when-a-group-learns": {
    "id": "cscl-who-learns-when-a-group-learns",
    "purpose": "Use this video to match a claim about learning to the level (person, group, community) at which the evidence was collected.",
    "distinction": "Stahl frames group cognition as a methodological choice about what to study, not a claim that a group mind exists; the cognitive tradition treats collaboration as a scaffold for each member's learning.",
    "caution": "The three students and their scores are made up; the example shows why the dispute is about definitions of learning, so no single experiment can settle it.",
    "koSummary": "이 영상은 협력 학습에서 “누가 배우는가”를 두고 Stahl의 집단 인지 관점과 개인 학습을 중시하는 인지 전통을 비교합니다. 주장이 개인·집단·공동체 중 어느 수준에 관한 것인지, 증거와 분석이 같은 수준에 있는지 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-collaborative-cognitive-load": {
    "id": "cscl-collaborative-cognitive-load",
    "purpose": "Use this video to judge when group work is likely to pay off and how a study defines task complexity, outcomes, and process.",
    "distinction": "CCLT counts coordination talk as a transaction cost that may be productive or extraneous; group-cognition researchers treat that talk as the learning itself.",
    "caution": "The French class is made up, and the cited average effect of collaboration is not a test of CCLT's complexity prediction, which has mixed support in the studies the video describes.",
    "koSummary": "이 영상은 여러 사람이 작업기억을 나눠 쓰지만 조정 비용이 이득을 상쇄할 수 있다는 협력적 인지부하 이론을 소개하고, 이에 대한 세 갈래의 반론을 정리합니다. 과제가 실제로 복잡했는지, 결과가 집단 산출물인지 이후 개인 시험인지, 대화 과정을 분석했는지 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-scripts-guidance-or-straitjacket": {
    "id": "cscl-scripts-guidance-or-straitjacket",
    "purpose": "Use this video to decide what a collaboration script should target, how it should fade or adapt, and which outcome a study measured.",
    "distinction": "Over-scripting can mean a script that is too rigid, or, in the script theory of guidance, one aimed at the wrong level for a particular learner.",
    "caution": "The classroom and students are made up, and the cited reviews could not test the theory's right-level principle and share authors with the theory, as the video itself notes.",
    "koSummary": "이 영상은 협력 스크립트가 토론을 돕는 사다리인지, 학습자를 묶는 틀인지를 과잉 스크립팅 비판과 스크립트 안내 이론을 중심으로 비교합니다. 어떤 결과를 측정했는지, 스크립트가 어느 수준을 겨냥하는지, 점차 줄이거나 조정되는지를 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-eight-provocations-for-cscl": {
    "id": "cscl-eight-provocations-for-cscl",
    "purpose": "Use this video to identify which assumptions a CSCL paper takes for granted and whether each claim rests on evidence, definitions, or values.",
    "distinction": "The Provocateur and Conciliator are composites built from researchers' responses, so no line belongs to a single researcher, and the original paper deliberately offers no resolutions.",
    "caution": "Room twelve and its ThinkBoard tool are made up; the video notes that, among the replies it checked, only the scripts-versus-agency provocation received a direct quantitative test.",
    "koSummary": "이 영상은 Wise와 Schwarz(2017)가 가상의 두 목소리인 도발자와 조정자의 대화로 쓴 CSCL 분야의 여덟 가지 도발을 소개하고, 그중 세 가지를 가상의 학급 사례에 적용해 봅니다. 논문을 읽을 때 어떤 도발에 암묵적으로 편을 드는지, 각 주장이 증거·정의·가치 중 무엇에 관한 것인지 따져 보라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-the-minimal-guidance-debate": {
    "id": "cscl-the-minimal-guidance-debate",
    "purpose": "Use this video to check what a guidance study compared, who its learners were (beginners or experts), and what it measured, and when.",
    "distinction": "Kirschner, Sweller and Clark grouped discovery, problem-based and inquiry learning together as minimal guidance; Hmelo-Silver and colleagues counted those methods as heavily scaffolded, and Kuhn moved the question from how to teach to what to teach.",
    "caution": "The two seventh-grade classes are made up, and the meta-analysis's comparison group was a mix, so its result does not show guided discovery beating direct instruction.",
    "koSummary": "이 영상은 최소 안내 교수가 초보 학습자에게 덜 효과적이라는 Kirschner, Sweller, Clark(2006)의 주장과, 문제 기반·탐구 학습은 비계가 풍부하다는 Hmelo-Silver 등의 반론, 그리고 무엇을 가르칠지를 먼저 물은 Kuhn의 질문을 비교합니다. 안내에 관한 연구를 읽을 때 무엇과 비교했는지, 학습자가 초보자인지 숙련자인지, 무엇을 언제 측정했는지 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-cognitive-vs-situative": {
    "id": "cscl-cognitive-vs-situative",
    "purpose": "Use this video to name what a study treats as the thing that learns (a person, a group, or a whole system) and whether its measures assume something acquired or a way of taking part.",
    "distinction": "The cognitive side starts from one person's mind and the situative side from people and tools interacting; Sfard named these acquisition and participation metaphors and warned against leaning on either alone.",
    "caution": "Ana and her fruit stall are made up; the joint paper listed points of agreement but left disputed whether the four claims were really situated learning's, and which unit of analysis to start from.",
    "koSummary": "이 영상은 상황 학습과 연결된 네 가지 주장이 지나치다는 Anderson, Reder, Simon의 비판과, 그것은 상황 학습의 핵심 주장이 아니며 진짜 차이는 개인의 마음에서 출발하는지 사람과 도구의 상호작용에서 출발하는지에 있다는 Greeno의 반론을 따라갑니다. 연구를 읽을 때 학습하는 주체가 개인·집단·체계 중 무엇인지, 측정이 무언가를 획득한다고 보는지 참여한다고 보는지 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-is-childrens-knowledge-coherent": {
    "id": "cscl-is-childrens-knowledge-coherent",
    "purpose": "Use this video to check how strictly a study defined consistency, how many situations it asked about, and whether it used open or forced-choice questions.",
    "distinction": "In Vosniadou's framework theory, 'theory' means a loose skeleton of ideas, not a scientist's theory; diSessa's knowledge in pieces does not claim that children's ideas are random or chaotic.",
    "caution": "Theo is made up and both readings fit his answers; the replication's authors said they did not know why their results differed from the original study's.",
    "koSummary": "이 영상은 아이들의 과학 개념이 상황에 따라 켜지는 작은 직관들의 모음이라는 diSessa의 관점과, 대체로 일관된 틀 이론을 이룬다는 Vosniadou의 관점을 비교합니다. 일관성을 얼마나 엄격하게 정의했는지, 몇 가지 상황을 물었는지, 개방형 질문인지 선택형 질문인지에 따라 결론이 달라질 수 있음을 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-is-transfer-real": {
    "id": "cscl-is-transfer-real",
    "purpose": "Use this video to check, when a paper reports no transfer, which definition it used, whether anyone could learn during the test, and who decided what counted as similar.",
    "distinction": "Detterman counts only a repeated behavior in a new situation; Bransford and Schwartz also count being ready to learn the new thing faster, and Lobato counts the learner's own links, even wrong ones.",
    "caution": "Sam is made up, the 2004 experiment used small groups, and the brain-training reviews concern training programs, not school learning.",
    "koSummary": "이 영상은 전이가 드물다는 Detterman(1993)의 주장, 고립된 일회성 시험이 더 빠른 학습으로 나타나는 전이를 놓친다는 Bransford와 Schwartz의 반론, 그리고 학습자 자신의 유사성 판단을 중시하는 Lobato의 관점을 비교합니다. '전이가 없다'는 결과를 볼 때 어떤 정의를 썼는지, 시험 중에 배울 기회가 있었는지, 무엇이 유사한지를 누가 정했는지 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-design-based-research-answer-to-what": {
    "id": "cscl-design-based-research-answer-to-what",
    "purpose": "Use this video to ask what a design study's question was before the design, what changed between cycles and which other explanations were checked, and what would have counted as failure.",
    "distinction": "Proponents read a gain as tool, teacher and setting working together; critics ask for a warrant and an argumentative grammar linking methods to claims, and both sides wanted standards.",
    "caution": "Ms. Ortiz's class and its scores are made up, and Dede's commentary is described only through others' reports, as the video notes.",
    "koSummary": "이 영상은 실제 교실에서 설계를 반복 개선하며 이론을 검증한다는 설계 기반 연구(DBR)의 주장과, 그 주장에 근거가 있는지, 방법과 자료를 잇는 논증 문법이 있는지, 언제 설계를 멈추거나 버려야 하는지를 물은 비판을 비교합니다. DBR 논문을 읽을 때 설계 이전의 연구 질문, 주기 사이에 바뀐 것과 다른 설명의 검토 여부, 무엇이 실패로 간주되었을지를 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-will-media-influence-learning": {
    "id": "cscl-will-media-influence-learning",
    "purpose": "Use this video to ask what else changed when a study credits a technology with better learning: the method, the amount of practice, the novelty, or the time on task.",
    "distinction": "Clark treats a medium as a vehicle that could be swapped for another with similar results; Kozma treats its capabilities, such as showing motion or letting you drag a model, as part of what makes a method possible.",
    "caution": "The tablet study is made up, and the later meta-analyses compare conditions that usually change the method too, so they do not settle the dispute.",
    "koSummary": "이 영상은 매체가 교수를 실어 나르는 수단일 뿐 학습을 일으키지 않는다는 Clark의 주장과, 좋은 설계에서는 매체의 기능이 교수 방법을 가능하게 한다는 Kozma의 반론을 비교합니다. 기술이 학습을 개선했다는 주장을 볼 때 교수 방법, 연습량, 새로움, 학습 시간 등 기술 외에 무엇이 함께 바뀌었는지 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-does-the-jigsaw-classroom-work": {
    "id": "cscl-does-the-jigsaw-classroom-work",
    "purpose": "Use this video to check, when a jigsaw paper reports an effect, whether the outcome was social or learning, whether the class really used expert groups and teaching back, and what it was compared with, in how many students.",
    "distinction": "Supporters point to the founders' reports and a large synthesis effect; the randomized experiments found about zero on learning against classes that already did some group work, and a zero against such classes is not the same as a zero against lecture.",
    "caution": "The four kids and their bike lesson are made up; the d = 1.20 figure is reported secondhand, the 2025 review counts studies rather than pooling effects, and treating social and learning claims separately is the video's own reading.",
    "koSummary": "이 영상은 1971년 미국 텍사스의 인종 통합 학교에서 시작된 직소(jigsaw) 수업이 실제로 효과가 있는지를 묻습니다. 초기 연구와 일부 종합 연구는 큰 효과를 보고했지만, 약 850명의 6학년을 대상으로 한 무작위 실험에서는 학습 효과가 거의 0이었고, 최근 리뷰는 연구 수를 세는 방식이라 효과의 크기까지는 알려 주지 않습니다. 직소 연구를 읽을 때 결과가 사회적 관계에 관한 것인지 학습에 관한 것인지, 실제로 전문가 모둠과 서로 가르치기 단계를 거쳤는지, 무엇과 비교했고 학생 수는 얼마였는지 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-when-is-hard-helpful": {
    "id": "cscl-when-is-hard-helpful",
    "purpose": "Use this video to check, when a study reports that a difficulty helped, how long after practice the test came, whether these learners could meet the challenge, and what kind of material was used.",
    "distinction": "Performance during practice and learning that lasts can split; van Gog and Sweller ask whether the testing benefit holds for complex material, and Karpicke and Aue reply that complexity was never defined in a measurable way.",
    "caution": "Leo and Mia are made up, van Gog and Sweller's paper is used only through its abstract, the reply's summary of their claim is stronger than that abstract's wording, and the spacing evidence comes mostly from tests within a day with young adults.",
    "koSummary": "이 영상은 스스로 시험 보기, 간격을 두고 공부하기, 문제 유형 섞기처럼 연습할 때는 더 어렵고 성과가 낮아 보여도 나중에 더 오래 남는다는 Bjork의 '바람직한 어려움'과, 서로 얽힌 요소가 많은 복잡한 자료에서는 그 효과가 사라질 수 있다는 van Gog와 Sweller의 문제 제기를 비교합니다. 관련 연구를 읽을 때 연습 후 얼마 뒤에 시험을 봤는지, 학습자가 그 어려움을 감당할 수 있었는지, 어떤 종류의 자료였는지 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-can-you-script-people-to-build-on-each-other": {
    "id": "cscl-can-you-script-people-to-build-on-each-other",
    "purpose": "Use this video to check whether students in a scripting study actually built on each other or were only prompted to, whether the abstract matches the results tables, and whether a gap between two groups was itself tested with enough power.",
    "distinction": "Transactivity means working on a partner's reasoning, not just saying okay; script theory predicts that requiring it improves learning, while the same group's meta-analysis could not show that prompting it beat other scripts for subject knowledge.",
    "caution": "Leo, Ana and the ice-cube chat are made up; the early link between transactivity and learning is correlational, the 2016 study is described from its abstract, and a non-significant gap with low power is not evidence of no effect.",
    "koSummary": "이 영상은 협력 스크립트로 학습자들이 상대의 추론을 받아 다시 발전시키게(transactivity) 할 수 있는지, 그리고 그것이 학습에 도움이 되는지를 묻습니다. 스크립트 이론은 이를 학습 원리로 내세웠지만, 같은 연구진의 메타분석에서는 이를 유도한 스크립트와 그렇지 않은 스크립트의 차이가 통계적으로 유의하지 않았고 검정력도 낮아 아직 어느 쪽이라고 말하기 어렵습니다. 연구를 읽을 때 학생들이 실제로 서로의 생각을 발전시켰는지, 초록이 결과 표와 맞는지, 두 집단의 차이를 충분한 검정력으로 직접 검정했는지 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-can-you-see-a-group-regulate-itself": {
    "id": "cscl-can-you-see-a-group-regulate-itself",
    "purpose": "Use this video to check whether a regulation study measured what the group did or only what members said, whether it had a comparison group or only strong and weak groups side by side, and which definition it used (thinking only, or also feelings and motivation).",
    "distinction": "Shared regulation (the whole group steers) is separated from self-regulation and co-regulation, but the video notes the levels are built into each other and that the review's naming truce, shared metacognition versus SSRL, is a choice of words, not a finding.",
    "caution": "Chloé and the podcast group are made up, and the example of coding only talk about time and plans is the video's illustration; all thirteen reviewed studies were descriptive without a control group, the 103-teacher study used student reports and compared strong and weak groups, and stronger students may have worked this way all along; the 2015 review predates newer studies, so check the date.",
    "koSummary": "이 영상은 집단이 스스로 학습을 조절하는 모습(사회적으로 공유된 조절, SSRL)을 실제로 관찰하고 구분할 수 있는지를 묻습니다. 2015년 리뷰는 공유된 조절을 공동 조절과 구분해 다룰 근거가 있다고 했지만, 13개 연구는 모두 기술적 연구였고 통제 집단이 없었으며 구성원의 보고에 의존한 연구도 많아 효과를 단정하기 어렵다고 합니다. 논문을 읽을 때는 집단의 행동을 측정했는지, 비교 집단이 있었는지, 정의에 감정과 동기가 포함되었는지를 확인하고 발표 연도도 살피라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-cooperation-or-collaboration": {
    "id": "cscl-cooperation-or-collaboration",
    "purpose": "Use this video to check, when a paper says a group cooperated or collaborated, which meaning it uses (split work or shared work), whether it looked at what the group said or only at how the task was set up, and why a message count is not proof of collaboration.",
    "distinction": "One pair of researchers separates cooperation (each person owns a piece) from collaboration (a steady effort to build one shared picture); Dillenbourg asks instead whether the split is fixed and spelled out at the start or woven together with roles that shift every few minutes.",
    "caution": "The three volcano students, including Jun and Mia, are made up; the sharp-line argument rests on one teenage pair picked as among the most collaborative and shows how shared understanding is built, not how often; the video says neither side ran a test, and reading the Jun-and-Mia version as collaboration at slide eight is the video's own reading.",
    "koSummary": "이 영상은 일을 나눠 맡은 뒤 이어 붙이는 모둠 활동이 협력(cooperation)인지 협동·협업(collaboration)인지를 둘러싼 논쟁을 다룹니다. 한 연구팀은 각자 한 조각을 맡으면 cooperation, 문제에 대한 하나의 공유된 그림을 함께 만들면 collaboration이라고 선을 긋고, Dillenbourg는 그 선이 더 흐릿하며 분업이 처음부터 고정되어 있는지 아니면 역할이 계속 바뀌며 엮이는지를 보아야 한다고 말합니다. 논문을 읽을 때는 어떤 의미로 쓰였는지, 집단이 실제로 한 말을 보았는지를 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-do-experts-just-remember-more": {
    "id": "cscl-do-experts-just-remember-more",
    "purpose": "Use this video to check, in an expertise study, how many people were tested, who counted as an expert, and whether a claim says the expert edge vanishes or only shrinks.",
    "distinction": "The classic study found no link between memory and strength on random boards, while the later review of thirteen experiments found a small but real edge; the video separates whether the edge is zero or small, which data can settle, from what counts as deep, which is partly definition.",
    "caution": "The classic study had only three players, so one tiny study is never the last word; the video frames the two sides as a self-correction since Simon co-wrote both papers; the novice-versus-expert abstraction contrast in physics is questioned by critics who attribute it to study set-up, and the video's two-kinds-of-question split is its own reading.",
    "koSummary": "이 영상은 전문가가 단지 기억을 더 많이 하는 것인지를 체스 배치 기억 연구로 따져 봅니다. 고전 연구는 세 명만 비교해 무작위 배치에서 기억과 실력의 관계가 없다고 보고 '청크'로 설명했고, 이후 13개 체스 실험 리뷰는 무작위 배치에서도 작지만 실제 이점이 남는다고 보고했습니다. 두 쪽 모두 전문성의 핵심이 단순한 기억량이 아니라 의미라는 데 동의하며, 논문을 읽을 때는 표본 규모와 전문가의 기준, 이점이 사라진다는 주장인지 줄어든다는 주장인지를 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-evidence-for-knowledge-building": {
    "id": "cscl-evidence-for-knowledge-building",
    "purpose": "Use this video to check, in a knowledge-building study, what the class was compared with, whether success was a standard test or how far ideas improved, and who ran the study in which schools.",
    "distinction": "Success by a standard test and success by idea improvement can point in different directions; the founders say improvement is the right yardstick, which the video calls a choice about what counts.",
    "caution": "The tomato class is made up; the early comparison was not rigorous by its authors' own statement, the three-year redesign study cannot separate students from design, every study read has a founder among its authors, no meta-analysis was found, and a good case shows that it can work, not how often it works.",
    "koSummary": "이 영상은 아이디어를 계속 개선하는 데 초점을 둔 지식 구축(knowledge building) 수업의 증거를 살펴봅니다. 초기 비교 연구는 저자들 스스로 엄격한 통제가 불가능했다고 밝혔고, 표준 검사 성과와 설명을 구하는 질문 같은 접근법 고유의 목표가 서로 다른 방향을 가리켰습니다. 이 영상은 검토한 연구마다 창시자가 저자로 포함되어 있고 메타분석은 찾지 못했다고 하며, 논문을 읽을 때는 무엇과 비교했는지, 성공을 어떻게 정의했는지, 누가 어느 학교에서 진행했는지를 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-how-much-effort-should-common-ground-take": {
    "id": "cscl-how-much-effort-should-common-ground-take",
    "purpose": "Use this video to check whether a study measured understanding or learning, what medium people were talking through, and whether common ground was actually observed or only a name for things going well.",
    "distinction": "Side A describes what people do when they talk (minimize joint effort until understanding is good enough); Side B says what designers of learning should aim for (keep some productive effort); the video reads both as right because they answer different questions.",
    "caution": "The siblings and the labeling app are made up; the leave-room-for-misunderstanding idea is a design idea, not a tested law; the classic evidence comes from lab tasks with strangers and measures understanding, not learning; the video says the sides are not letters back and forth, and whether extra effort helps learning remains open.",
    "koSummary": "이 영상은 함께 배울 때 공통 기반(common ground)을 만드는 노력을 줄이는 것이 늘 좋은지를 묻습니다. Clark 연구진은 사람들이 당장 충분히 이해했다고 믿을 때까지 확인하되 공동 작업을 최소로 유지한다고 설명하고, 협력 학습 연구는 그 추가 노력이 느리게 만들더라도 학습에 도움이 될 수 있다고 보지만 이는 검증된 법칙이 아니라 설계 아이디어입니다. 논문을 읽을 때는 이해를 측정했는지 학습을 측정했는지, 어떤 매체로 대화했는지, 공통 기반을 실제로 관찰했는지를 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-is-it-the-explaining-or-the-extra-time": {
    "id": "cscl-is-it-the-explaining-or-the-extra-time",
    "purpose": "Use this video to check, in a self-explanation study, whether study time was equal or at least reported, what the comparison group got (nothing, rereading or a good explanation), and whether groups were assigned or sorted after the scores came in.",
    "distinction": "Side A says explaining itself does the work; Side B doubts it on time and on content (the coverage hypothesis), and the video notes that the tension runs through nearly thirty years of studies rather than one paper answering another.",
    "caution": "Pat and Jun are made up; the early physics study had four students per group sorted after the scores, which shows a link rather than a cause; the equal-time result (about 0.4) rests on only five results and the given-explanation comparison (about 0.35) on six, and the gap between time-controlled and other results was not significant; the 36-student clue and the point that self-explaining differs from summarizing or teaching a friend are stated as limits.",
    "koSummary": "이 영상은 스스로 설명하기가 효과적인 이유가 설명 자체 때문인지, 아니면 더 오래 공부했기 때문인지를 묻습니다. 초기 연구들은 설명을 많이 한 학생이 더 잘 배웠다고 보였지만 표본이 작고 시간이 통제되지 않았고, 69개 결과를 모은 리뷰에서는 시간을 같게 한 경우에도 효과가 남지만 더 작았고(약 0.4, 5개 결과), 교사의 좋은 설명과 비교하면 더 작았습니다(약 0.35, 6개 결과). 논문을 읽을 때는 학습 시간이 같았는지, 비교 집단이 무엇을 받았는지, 집단이 무작위로 배정되었는지를 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-smart-dashboards-or-modest-tools": {
    "id": "cscl-smart-dashboards-or-modest-tools",
    "purpose": "Use this video to check whether a classroom-technology study had a comparison group or only a before and after, whether it measured learning or only time and use, and what the tool decides versus what stays with the teacher.",
    "distinction": "Side A argues for minimal tools that keep the teacher in control because every menu adds load; Side B argues modest tools may miss what student data could add; the synthesis says the replies agree that classrooms are complex and the teacher's say matters.",
    "caution": "The 28-student class is made up; the physics figures (62, 16 and 6 percent) are estimates from a design study without a concurrent comparison class or learning outcomes, and the authors called minimalism a hypothesis; the smart-glasses result is known only from an abstract and summary, and the replies are read only via the synthesis.",
    "koSummary": "이 영상은 수업 중 교사가 여러 모둠을 동시에 조율(orchestration)할 때 기술이 교사에게 더 많이 보여 줘야 하는지 적게 보여 줘야 하는지를 묻습니다. 한쪽은 도구를 단순하게 하고 교사가 통제권을 갖게 하자고 하며 물리 실습에서 대기 시간이 크게 줄었다고 보고했지만, 이는 동시 비교 집단이나 학습 성과가 없는 설계 연구입니다. 다른 쪽은 학생 데이터를 활용한 스마트 도구의 가능성을 말하며, 논문을 읽을 때는 비교 집단과 학습 측정이 있었는지, 도구가 무엇을 결정하는지를 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "cscl-group-awareness-mirror-or-nudge": {
    "id": "cscl-group-awareness-mirror-or-nudge",
    "purpose": "Use this video to check whether a group awareness study's outcome is how the group talks or what they learned, whether students had to use the tool and actually did, and whether it was compared with no tool or with another version of the tool.",
    "distinction": "A mirror only shows information and leaves the group to decide what to do; a nudge shapes the information to steer learners toward good habits. The video treats both as coming from the same lead author, so it reads this as a refinement, and notes that relying on students to steer themselves is part of the definition.",
    "caution": "The four students, including Jun and Mia, are made up; the one test the video found had only three whole classes, and its long-messages result was borderline, with no gain in equal participation or group grade, in a setting where the tool was optional and participation was already fairly equal; the 46-study meta-analysis is known only from its summary, and researchers rarely measure the awareness itself.",
    "koSummary": "이 영상은 집단 인식(group awareness) 도구가 중립적인 거울인지, 학습자를 이끄는 넛지인지를 묻습니다. 같은 제1저자의 두 관점은 도구가 명령 없이 정보만 보여 준다는 점과 정보를 골라 좋은 습관으로 유도한다는 점을 각각 강조하며, 네덜란드 11학년 연구에서는 긴 메시지가 약간 늘었지만 경계 수준이었고 참여의 평등이나 집단 성적은 나아지지 않았습니다. 논문을 읽을 때는 결과가 대화 방식인지 학습인지, 학생이 도구를 써야 했고 실제로 썼는지, 무엇과 비교했는지를 확인하라고 안내합니다.",
    "reviewedAt": "2026-10-16",
    "sources": [],
    "verificationNote": "Caption-based editorial guide; external references not independently rechecked in this update."
  },
  "irt-basic": {
    "id": "irt-basic",
    "purpose": "Use this lecture to see how IRT places students and items on one scale and how an item characteristic curve encodes difficulty, discrimination, and guessing.",
    "distinction": "A raw score depends on which items a student happened to take, while an IRT ability estimate sits on a scale shared with item difficulties, so forms calibrated together can be compared; in the Rasch model the total on the same items is still all the estimate uses.",
    "caution": "Lena, Sam, the quiz, and every number are made up, so the video shows how the models work and is not evidence about any real test; real calibration needs many responses per item and a check that the model fits.",
    "koSummary": "이 강의는 쉬운 버전과 어려운 버전의 분수 퀴즈에서 똑같이 10점 만점에 6점을 받은 두 학생(가상 사례)을 통해 문항반응이론(IRT)을 소개합니다. 학생의 능력과 문항의 난이도를 같은 로짓 척도에 놓고, 문항특성곡선에서 난이도·변별도·추측 모수가 각각 무엇을 뜻하는지 보여 줍니다. Rasch 모형에서는 같은 문항에서 같은 총점이면 같은 추정치를 얻는다는 점, 그리고 IRT는 검사 중 능력을 고정된 것으로 보지만 지식추적은 연습에 따른 변화를 따라간다는 점을 주의점으로 정리합니다.",
    "sources": [],
    "verificationNote": "Caption-based editorial guide. Further reading not yet added or checked.",
    "reviewedAt": "2026-10-29"
  },
  "cognitive-apprenticeship": {
    "id": "cognitive-apprenticeship",
    "purpose": "Use this lecture to see the six methods of cognitive apprenticeship and how each one makes an expert's thinking, or a learner's, visible.",
    "distinction": "A traditional apprentice can watch a visible process, while cognitive apprenticeship has to externalize thinking: the expert thinks aloud, support fades as learners succeed, and learners articulate and reflect on their own reasoning.",
    "caution": "The ladder problem, the teacher, and the students are made up, and the framework is a set of design principles rather than one tested program, so each method needs its own evaluation in a new setting.",
    "koSummary": "이 강의는 Collins, Brown, Newman(1989)이 제안한 인지적 도제(cognitive apprenticeship)를 소개합니다. 학교에서 가장 중요한 과정인 사고는 눈에 보이지 않기 때문에, 교사가 사다리 문제(가상 사례)를 소리 내어 풀며 모델링하고, 코칭과 스캐폴딩 및 지원의 점진적 제거(fading), 학습자의 설명(articulation)과 성찰(reflection), 스스로 문제를 만드는 탐색(exploration)으로 사고를 보이게 만드는 방법을 정리합니다. 과제는 복잡성과 다양성을 높여 가며 부분보다 전체 과제를 먼저 보여 주도록 배열하고, 이 틀은 하나의 검증된 프로그램이 아니라 설계 원리이므로 새로운 맥락에서는 각 방법을 따로 평가해야 한다는 점을 주의점으로 둡니다.",
    "sources": [],
    "verificationNote": "Caption-based editorial guide. The video names Collins, Brown, and Newman (1989); further-reading links are not yet added or checked.",
    "reviewedAt": "2026-10-29"
  },
  "4cid-basic": {
    "id": "4cid-basic",
    "purpose": "Use this lecture to see the four components of 4C/ID and how they fit together in a blueprint for teaching a complex skill.",
    "distinction": "Supportive information serves the non-routine parts of a task, which call for reasoning and are never done the same way twice, while procedural information serves the routine parts, given just in time and removed once learners no longer need it.",
    "caution": "The search course, its tasks, and its learners are made up, and 4C/ID is a detailed design model rather than a quick recipe, so a real blueprint needs an analysis of the skill and a tryout with its own learners.",
    "koSummary": "이 강의는 Jeroen van Merriënboer가 개발한 4C/ID(네 요소 교수설계) 모형을 문헌 검색을 가르치는 가상 강좌로 소개합니다. 실제적인 전체 과제로 이루어진 학습 과제를 단순한 과제군에서 복잡한 과제군으로 배열하고, 각 과제군 안에서는 지원이 줄어들었다가 다음 과제군에서 다시 높아지는 톱니 모양 지원을 보여 줍니다. 추론이 필요한 부분에는 지원 정보를, 매번 같은 방식으로 하는 절차적 부분에는 필요한 순간에 주는 절차 정보를, 자동화가 필요한 단계에는 전체 과제 사이에 섞어 넣는 부분 과제 연습을 둡니다. 마지막으로 전체 청사진을 보여 주고, 빠른 처방이 아니라 기술 분석과 실제 학습자 대상 시행이 필요한 상세한 설계 모형이라는 점을 주의점으로 둡니다.",
    "sources": [],
    "verificationNote": "Caption-based editorial guide. The video names Jeroen van Merriënboer as the model's developer; further-reading links are not yet added or checked.",
    "reviewedAt": "2026-10-29"
  },
  "first-principles": {
    "id": "first-principles",
    "purpose": "Use this lecture to see Merrill's five first principles and how one workshop can apply all of them around a single real task.",
    "distinction": "Problem-centered instruction organizes the lesson around a real task, while activation, demonstration, application, and integration are the phases that cycle around it: recalling experience, seeing the skill shown, using it with feedback, and carrying it into the learner's own world.",
    "caution": "The workshop, Leo, and the questions are made up, and Merrill drew these principles from existing theories rather than from one experiment, so treat them as a design guide and check how they work with your own learners.",
    "koSummary": "이 강의는 David Merrill이 2002년 여러 교수설계 이론을 비교해 정리한 교수의 제1원리(first principles of instruction)를, 신임 조교들이 객관식 퀴즈 문항 작성법을 배우는 가상 워크숍으로 소개합니다. 조교 Leo를 따라 규칙 목록 대신 실제 과제로 시작하는 문제 중심 원리, 예전에 점수를 잃었던 함정 문항을 떠올리는 활성화, 약한 문항과 좋은 문항을 나란히 보여 주는 시연, 직접 문항을 쓰고 피드백을 받아 고치는 적용, 자신의 수업과 동료에게 가져가는 통합을 차례로 보여 줍니다. 네 단계를 문제를 둘러싼 순환으로 그리고, 문제는 단순한 것에서 복잡한 것으로 커질 수 있다고 설명하며, 이 원리들은 하나의 실험이 아니라 기존 이론에서 끌어낸 설계 지침이라는 점을 주의점으로 둡니다.",
    "sources": [],
    "verificationNote": "Caption-based editorial guide. The video names David Merrill (2002); further-reading links are not yet added or checked.",
    "reviewedAt": "2026-10-29"
  },
  "backward-design": {
    "id": "backward-design",
    "purpose": "Use this lecture to see the three stages of backward design and how constructive alignment checks that outcomes, activities, and assessment point at the same thing.",
    "distinction": "Backward design is a planning order: decide the desired results, then the evidence that would show them, and only then the learning activities. Constructive alignment is the check that the intended outcomes, the learning activities, and the assessment all target the same performance.",
    "caution": "Nadia, her unit, and the chart are made up, and an aligned unit still needs evidence that students actually learn, so treat alignment as a design check rather than a guarantee.",
    "koSummary": "이 강의는 Grant Wiggins와 Jay McTighe가 제시한 역방향 설계(backward design)와, John Biggs가 말한 밀접한 개념인 구성적 정렬(constructive alignment)을, 뉴스 속 차트 단원을 계획하는 가상의 교사 Nadia의 사례로 소개합니다. 활동을 먼저 정하고 시험을 마지막에 만드는 순방향 계획에서는 어떤 활동도 준비시키지 않은 것을 시험이 측정할 수 있다는 점을 보여 주고, 기대하는 결과, 증거, 학습 경험이라는 세 단계를 차례로 설명합니다. 세로축이 50에서 시작하는 뉴스 차트와 0부터 다시 그린 같은 차트를 비교하고, 활동 중심 설계와 진도 중심 설계라는 두 가지 함정을 보여 주며, 목표·활동·평가를 3D 삼각형으로 그려 평가가 목표에서 벗어났다가 다시 정렬되는 모습을 보여 줍니다. 정렬은 학습을 보장하는 것이 아니라 설계 점검이라는 점을 주의점으로 둡니다.",
    "sources": [],
    "verificationNote": "Caption-based editorial guide. The video names Wiggins & McTighe (1998) and Biggs (1996); further-reading links are not yet added or checked.",
    "reviewedAt": "2026-10-29"
  },
  "gagne-nine-events": {
    "id": "gagne-nine-events",
    "purpose": "Use this lecture to see Gagné's nine events of instruction and how one short lab lesson can include all of them.",
    "distinction": "The nine events are what the instructor arranges outside the learner, from gaining attention to supporting transfer; each one is meant to support a process inside the learner, such as attention, expectancy, retrieval, encoding, and generalization.",
    "caution": "Priya, her lab, and the samples are made up, and the events are a checklist of conditions rather than a fixed script: their order can change, and not every lesson needs all nine.",
    "koSummary": "이 강의는 Robert Gagné가 학습의 조건과 연결해 제시한 아홉 가지 수업 사태(nine events of instruction)를, 신입 실험 보조원에게 마이크로피펫 사용법을 가르치는 가상의 트레이너 Priya의 사례로 소개합니다. 같아야 할 두 시료가 다르게 나온 장면으로 주의를 끌고, 학습 목표를 알리고, 메스실린더 눈금 읽는 법을 떠올리게 한 뒤, 플런저의 두 단계 멈춤점을 제시하고, 따라 말할 수 있는 단서로 학습을 안내합니다. 이어 반복 연습, 저울로 공기 방울을 잡아내는 피드백, 힌트 없는 최종 확인, 실제 실험으로의 전이를 차례로 보여 줍니다. Gagné가 각 사태를 주의부터 일반화까지 학습자 내부의 과정과 짝지었다는 점을 계단으로 그리고, 아홉 사태는 고정된 대본이 아니라 조건의 점검표라는 점을 주의점으로 둡니다.",
    "sources": [],
    "verificationNote": "Caption-based editorial guide. The video names Gagné (1965) and Gagné, Briggs & Wager (1992); further-reading links are not yet added or checked.",
    "reviewedAt": "2026-10-29"
  }
};

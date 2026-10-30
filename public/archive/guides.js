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
    "sources": [
      {
        "title": "The basics of item response theory (2nd ed.)",
        "authors": "Frank B. Baker",
        "year": 2001,
        "url": "https://eric.ed.gov/?id=ED458219",
        "relationship": "Further reading",
        "access": "Open access · ERIC",
        "verificationNote": "ERIC record ED458219 opens with this title."
      },
      {
        "title": "Item response theory for psychologists",
        "authors": "Susan E. Embretson and Steven P. Reise",
        "year": 2000,
        "url": "https://doi.org/10.4324/9781410605269",
        "relationship": "Further reading",
        "access": "Book · publisher page",
        "verificationNote": "DOI resolves to the publisher page with this title."
      }
    ],
    "verificationNote": "Caption-based editorial guide. Further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-29"
  },
  "cognitive-apprenticeship": {
    "id": "cognitive-apprenticeship",
    "purpose": "Use this lecture to see the six methods of cognitive apprenticeship and how each one makes an expert's thinking, or a learner's, visible.",
    "distinction": "A traditional apprentice can watch a visible process, while cognitive apprenticeship has to externalize thinking: the expert thinks aloud, support fades as learners succeed, and learners articulate and reflect on their own reasoning.",
    "caution": "The ladder problem, the teacher, and the students are made up, and the framework is a set of design principles rather than one tested program, so each method needs its own evaluation in a new setting.",
    "koSummary": "이 강의는 Collins, Brown, Newman(1989)이 제안한 인지적 도제(cognitive apprenticeship)를 소개합니다. 학교에서 가장 중요한 과정인 사고는 눈에 보이지 않기 때문에, 교사가 사다리 문제(가상 사례)를 소리 내어 풀며 모델링하고, 코칭과 스캐폴딩 및 지원의 점진적 제거(fading), 학습자의 설명(articulation)과 성찰(reflection), 스스로 문제를 만드는 탐색(exploration)으로 사고를 보이게 만드는 방법을 정리합니다. 과제는 복잡성과 다양성을 높여 가며 부분보다 전체 과제를 먼저 보여 주도록 배열하고, 이 틀은 하나의 검증된 프로그램이 아니라 설계 원리이므로 새로운 맥락에서는 각 방법을 따로 평가해야 한다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "Cognitive apprenticeship: Teaching the crafts of reading, writing, and mathematics",
        "authors": "Allan Collins, John Seely Brown, and Susan E. Newman",
        "year": 1989,
        "url": "https://doi.org/10.4324/9781315044408-14",
        "relationship": "Further reading",
        "access": "Book chapter · publisher page",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page. Chapter in Knowing, Learning, and Instruction (Resnick, Ed.); the DOI is the 2018 Routledge reissue."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Collins, Brown, and Newman (1989); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-29"
  },
  "4cid-basic": {
    "id": "4cid-basic",
    "purpose": "Use this lecture to see the four components of 4C/ID and how they fit together in a blueprint for teaching a complex skill.",
    "distinction": "Supportive information serves the non-routine parts of a task, which call for reasoning and are never done the same way twice, while procedural information serves the routine parts, given just in time and removed once learners no longer need it.",
    "caution": "The search course, its tasks, and its learners are made up, and 4C/ID is a detailed design model rather than a quick recipe, so a real blueprint needs an analysis of the skill and a tryout with its own learners.",
    "koSummary": "이 강의는 Jeroen van Merriënboer가 개발한 4C/ID(네 요소 교수설계) 모형을 문헌 검색을 가르치는 가상 강좌로 소개합니다. 실제적인 전체 과제로 이루어진 학습 과제를 단순한 과제군에서 복잡한 과제군으로 배열하고, 각 과제군 안에서는 지원이 줄어들었다가 다음 과제군에서 다시 높아지는 톱니 모양 지원을 보여 줍니다. 추론이 필요한 부분에는 지원 정보를, 매번 같은 방식으로 하는 절차적 부분에는 필요한 순간에 주는 절차 정보를, 자동화가 필요한 단계에는 전체 과제 사이에 섞어 넣는 부분 과제 연습을 둡니다. 마지막으로 전체 청사진을 보여 주고, 빠른 처방이 아니라 기술 분석과 실제 학습자 대상 시행이 필요한 상세한 설계 모형이라는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "Blueprints for complex learning: The 4C/ID-model",
        "authors": "Jeroen J. G. van Merriënboer, Richard E. Clark, and Marcel B. M. de Croock",
        "year": 2002,
        "url": "https://doi.org/10.1007/BF02504993",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "Ten steps to complex learning: A systematic approach to four-component instructional design (3rd ed.)",
        "authors": "Jeroen J. G. van Merriënboer and Paul A. Kirschner",
        "year": 2017,
        "url": "https://doi.org/10.4324/9781315113210",
        "relationship": "Further reading",
        "access": "Book · publisher page",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Jeroen van Merriënboer as the model's developer; further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-29"
  },
  "first-principles": {
    "id": "first-principles",
    "purpose": "Use this lecture to see Merrill's five first principles and how one workshop can apply all of them around a single real task.",
    "distinction": "Problem-centered instruction organizes the lesson around a real task, while activation, demonstration, application, and integration are the phases that cycle around it: recalling experience, seeing the skill shown, using it with feedback, and carrying it into the learner's own world.",
    "caution": "The workshop, Leo, and the questions are made up, and Merrill drew these principles from existing theories rather than from one experiment, so treat them as a design guide and check how they work with your own learners.",
    "koSummary": "이 강의는 David Merrill이 2002년 여러 교수설계 이론을 비교해 정리한 교수의 제1원리(first principles of instruction)를, 신임 조교들이 객관식 퀴즈 문항 작성법을 배우는 가상 워크숍으로 소개합니다. 조교 Leo를 따라 규칙 목록 대신 실제 과제로 시작하는 문제 중심 원리, 예전에 점수를 잃었던 함정 문항을 떠올리는 활성화, 약한 문항과 좋은 문항을 나란히 보여 주는 시연, 직접 문항을 쓰고 피드백을 받아 고치는 적용, 자신의 수업과 동료에게 가져가는 통합을 차례로 보여 줍니다. 네 단계를 문제를 둘러싼 순환으로 그리고, 문제는 단순한 것에서 복잡한 것으로 커질 수 있다고 설명하며, 이 원리들은 하나의 실험이 아니라 기존 이론에서 끌어낸 설계 지침이라는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "First principles of instruction",
        "authors": "M. David Merrill",
        "year": 2002,
        "url": "https://doi.org/10.1007/BF02505024",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names David Merrill (2002); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-29"
  },
  "backward-design": {
    "id": "backward-design",
    "purpose": "Use this lecture to see the three stages of backward design and how constructive alignment checks that outcomes, activities, and assessment point at the same thing.",
    "distinction": "Backward design is a planning order: decide the desired results, then the evidence that would show them, and only then the learning activities. Constructive alignment is the check that the intended outcomes, the learning activities, and the assessment all target the same performance.",
    "caution": "Nadia, her unit, and the chart are made up, and an aligned unit still needs evidence that students actually learn, so treat alignment as a design check rather than a guarantee.",
    "koSummary": "이 강의는 Grant Wiggins와 Jay McTighe가 제시한 역방향 설계(backward design)와, John Biggs가 말한 밀접한 개념인 구성적 정렬(constructive alignment)을, 뉴스 속 차트 단원을 계획하는 가상의 교사 Nadia의 사례로 소개합니다. 활동을 먼저 정하고 시험을 마지막에 만드는 순방향 계획에서는 어떤 활동도 준비시키지 않은 것을 시험이 측정할 수 있다는 점을 보여 주고, 기대하는 결과, 증거, 학습 경험이라는 세 단계를 차례로 설명합니다. 세로축이 50에서 시작하는 뉴스 차트와 0부터 다시 그린 같은 차트를 비교하고, 활동 중심 설계와 진도 중심 설계라는 두 가지 함정을 보여 주며, 목표·활동·평가를 3D 삼각형으로 그려 평가가 목표에서 벗어났다가 다시 정렬되는 모습을 보여 줍니다. 정렬은 학습을 보장하는 것이 아니라 설계 점검이라는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "Enhancing teaching through constructive alignment",
        "authors": "John Biggs",
        "year": 1996,
        "url": "https://doi.org/10.1007/BF00138871",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Wiggins & McTighe (1998) and Biggs (1996); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
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
  },
  "addie-sam": {
    "id": "addie-sam",
    "purpose": "Use this lecture to compare ADDIE and SAM as ways a design team moves from a request to a finished course, and to see where feedback from learners arrives in each.",
    "distinction": "ADDIE names five phases of work (analysis, design, development, implementation, evaluation) and is a label for a family of systems approaches; SAM keeps similar work but organizes it as a savvy start followed by short cycles of design, prototype, and review, with alpha, beta, and gold releases tried by learners.",
    "caution": "Omar, the warehouse, and the course are made up. Neither process guarantees learning, ADDIE in practice often loops back between phases, and fast prototypes can drift without clear objectives, so many teams combine careful analysis with iteration.",
    "koSummary": "이 강의는 두 가지 교수설계 과정 모형인 ADDIE와 Michael Allen의 연속 근사 모형(SAM)을, 창고 직원용 짧은 안전 교육 과정을 만드는 가상의 설계자 Omar의 사례로 소개합니다. 분석, 설계, 개발, 실행, 평가의 다섯 단계를 차례로 보여 주고, 단계를 엄격히 한 방향으로만 진행하면 혼란스러운 지게차 시나리오 같은 문제가 몇 달 뒤 첫 테스트에서야 드러나 되돌리기 비싸다는 점을 보여 줍니다. ADDIE에는 단일한 원저자가 없고 체제적 접근의 한 계열을 가리키는 이름이라는 Michael Molenda의 지적을 소개한 뒤, SAM의 세비 스타트(savvy start), 설계·프로토타입·검토의 짧은 반복, 한 시간 만에 고친 종이 스케치, 알파·베타·골드 릴리스를 보여 줍니다. 어느 과정도 학습을 보장하지 않으며, 많은 팀이 신중히 분석한 뒤 반복한다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "In search of the elusive ADDIE model",
        "authors": "Michael Molenda",
        "year": 2003,
        "url": "https://doi.org/10.1002/pfi.4930420508",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Molenda (2003) and Allen & Sites (2012); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-29"
  },
  "theory-model-framework": {
    "id": "theory-model-framework",
    "purpose": "Use this lecture to sort the ideas you draw on in design work by what they do: explain why, guide what to do, or organize what to look at.",
    "distinction": "A theory explains and predicts and can be tested; a model is a simplified picture of how something is done and guides action; a framework organizes concepts into a structure that tells you what to look at, without steps or predictions of its own.",
    "caution": "Lena and her course are made up. Authors do not use these labels consistently (Reigeluth called prescriptive guidance instructional-design theory), so judge a work by what it does, not only by what it is called.",
    "koSummary": "이 강의는 교수설계에서 자주 섞어 쓰이는 이론, 모형, 프레임워크를 구분합니다. 이론은 설명하고 예측합니다. 인지부하 이론은 초보자가 스스로 문제를 푸는 것보다 풀이 예제로 더 많이 배우는 이유를 설명하고, 전문성이 쌓이면 그 이점이 사라진다고 예측하므로 검증될 수 있고 틀릴 수도 있습니다. 모형은 무언가를 하는 방식을 단순화한 그림으로, 수업에 들어갈 요소(Gagné의 9가지 수업사태)나 설계 팀이 따르는 단계(ADDIE)를 보여 주며 행동을 안내하지만 각 단계가 왜 효과적인지는 대개 말하지 않습니다. 탐구공동체(Community of Inquiry)와 같은 프레임워크는 개념을 구조로 묶어 무엇을 볼지 알려 주지만 단계나 예측을 제시하지는 않습니다. 가상의 설계자 Lena가 온라인 통계 강좌 하나에 세 가지를 모두 쓰는 사례를 보여 주고, 설명·안내·조직의 삼각형 위에 각각을 놓으며 4C/ID가 안내에서 설명 쪽으로 기운다는 점을 보여 줍니다. 저자들이 이 이름을 일관되게 쓰지 않는다는 점(Reigeluth는 처방적 지침을 교수설계 이론이라 불렀음)을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "Cognitive load during problem solving: Effects on learning",
        "authors": "John Sweller",
        "year": 1988,
        "url": "https://doi.org/10.1207/s15516709cog1202_4",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "Critical inquiry in a text-based environment: Computer conferencing in higher education",
        "authors": "D. Randy Garrison, Terry Anderson, and Walter Archer",
        "year": 1999,
        "url": "https://doi.org/10.1016/S1096-7516(00)00016-6",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher site, which showed a browser check. The journal issue is dated 1999; the article is often cited as 2000."
      },
      {
        "title": "Instructional-design theories and models: A new paradigm of instructional theory (Vol. 2)",
        "authors": "Charles M. Reigeluth (Ed.)",
        "year": 1999,
        "url": "https://doi.org/10.4324/9781410603784",
        "relationship": "Further reading",
        "access": "Book · publisher page",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page. The DOI is the 2013 Routledge reissue."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Sweller (1988), Garrison, Anderson & Archer (2000), and Reigeluth (1999); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "dick-carey": {
    "id": "dick-carey",
    "purpose": "Use this lecture to walk through the ten steps of the Dick and Carey model on one small project and to see where formative evaluation sends a designer back to earlier steps.",
    "distinction": "Dick and Carey treat instruction as a system: the goal, instructional analysis, learner and context analysis, objectives, assessments, strategy, and materials depend on one another, assessments are written before the strategy, and revision after formative evaluation can reach back to any earlier step; summative evaluation comes later and asks whether to keep the instruction.",
    "caution": "Tomás, the bank, and the training are made up. Drawn as boxes and arrows, the model can look rigid, and its full form can feel heavy for small or fast projects, so many designers scale the steps to the project.",
    "koSummary": "이 강의는 1978년에 처음 출판된 Walter Dick과 Lou Carey의 체제적 교수설계 모형을 소개합니다. 이 모형은 수업을 서로 의존하는 부분들의 체제로 보고, 목표 확인부터 완성된 수업의 평가까지 열 단계를 제시합니다. 가상의 설계자 Tomás가 신입 은행 창구 직원을 위한 위조지폐 식별 교육을 만드는 사례에서, 목표를 정하고, 전문가가 따르는 단계를 분석하면서 동시에 학습자와 바쁜 창구라는 맥락을 분석하며, 조건·행동·준거를 갖춘 수행목표를 쓰고, 가르칠 내용을 계획하기 전에 평가 도구를 먼저 개발합니다. 이어서 교수전략과 자료를 만들고, 한 명, 소집단, 한 지점 단위로 형성평가를 하며, 직원들이 보안 실을 확인하지 않는다는 점이 드러나자 분석과 연습을 수정합니다. 수정이 앞의 어느 단계로든 되돌아갈 수 있다는 되돌림 화살표를 모형의 핵심으로 보여 주고, 이어 총괄평가를 다룹니다. 백워드 설계 및 Gagné의 학습 위계와의 연결을 짚고, 작고 빠른 프로젝트에는 모형 전체가 무겁게 느껴질 수 있어 많은 설계자가 단계를 프로젝트 규모에 맞춘다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "The Dick and Carey model: Will it survive the decade?",
        "authors": "Walter Dick",
        "year": 1996,
        "url": "https://doi.org/10.1007/BF02300425",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Dick & Carey (1978) and Dick, Carey & Carey (2015); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "kirkpatrick": {
    "id": "kirkpatrick",
    "purpose": "Use this lecture to sort the evidence a training evaluation collects into reaction, learning, behavior, and results, and to see why each level does not guarantee the next.",
    "distinction": "Kirkpatrick's levels ask different questions: reaction (did participants find it useful and engaging), learning (did they gain the knowledge and skill), behavior (do they apply it on the job), and results (did the organization's outcomes change). Later versions suggest planning from the needed result back to the reaction.",
    "caution": "Mei, the hospital, and the numbers are made up. Reactions are only weakly related to learning and transfer (Alliger et al., 1997), and results have many causes besides training, so a drop in an outcome does not by itself prove that the training worked.",
    "koSummary": "이 강의는 교육이 효과가 있었는지 묻기 위해 Donald Kirkpatrick이 1959년에 제안한 네 수준, 곧 반응, 학습, 행동, 결과를 소개하며, 뒤로 갈수록 대개 측정하기 더 어렵다는 점을 보여 줍니다. 가상의 교육 담당자 Mei가 병원 직원을 위한 손 위생 교육을 운영하며 각 수준을 차례로 확인합니다. 교육이 끝날 때의 설문, 손을 씻어야 하는 순간에 대한 퀴즈와 손 씻기 기술 점검, 몇 주 뒤 병동에서 관찰자가 세는 손 위생 횟수, 그리고 병동의 감염률입니다. 네 수준은 사슬을 이루지만 보장된 사슬은 아니라는 점을, 반응이 학습 및 현업 적용과 약하게만 관련된다는 George Alliger와 동료들의 메타분석을 들어 보여 주며, 따라서 높은 만족도 점수만으로는 행동이나 결과에 대해 알 수 있는 것이 적다고 설명합니다. 모형의 후속판이 결과에서부터 거꾸로 계획하도록 제안한다는 점을 백워드 설계와 연결하고, 결과에는 새 비누 디스펜서나 인력 변화처럼 교육 외의 원인이 많다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "A meta-analysis of the relations among training criteria",
        "authors": "George M. Alliger, Scott I. Tannenbaum, Winston Bennett Jr., Holly Traver, and Allison Shotland",
        "year": 1997,
        "url": "https://doi.org/10.1111/j.1744-6570.1997.tb00911.x",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "A critical analysis of evaluation practice: The Kirkpatrick model and the principle of beneficence",
        "authors": "Reid Bates",
        "year": 2004,
        "url": "https://doi.org/10.1016/j.evalprogplan.2004.04.011",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Kirkpatrick (1959), Alliger, Tannenbaum, Bennett, Traver & Shotland (1997), and Kirkpatrick & Kirkpatrick (2016); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "learning-objectives": {
    "id": "learning-objectives",
    "purpose": "Use this lecture to rewrite a vague course goal as an observable objective and to check which kind of thinking its verb asks for.",
    "distinction": "Mager's objectives name a performance, the conditions under which it happens, and a criterion for how well; the ABCD format adds the audience. The revised Bloom's taxonomy (Anderson & Krathwohl, 2001) sorts objectives by cognitive process (remember to create) and by kind of knowledge (factual, conceptual, procedural, metacognitive).",
    "caution": "Ana and her course are made up. Verb lists are rough guides, since the same verb can sit at different levels, and objectives that are easy to measure can crowd out goals that matter but are hard to observe.",
    "koSummary": "이 강의는 \"학생들은 응급처치를 이해할 것이다\"와 같은 모호한 목표를, 학습자가 무엇을 할 수 있게 될지를 다른 사람이 관찰할 수 있는 형태로 기술한 목표로 바꾸는 법을 다룹니다. Robert Mager의 세 요소(수행, 조건, 준거)와 여기에 대상(audience)을 더한 ABCD 형식을 소개합니다. 가상의 응급처치 강사 Ana가 \"CPR을 이해한다\"를 \"훈련용 마네킹이 주어지면, 학습자는 분당 100~120회의 속도로 가슴 압박 30회를 실시한다\"로 고쳐 씁니다. 이어서 동사가 사고의 종류를 드러낸다는 점을 Lorin Anderson과 David Krathwohl이 개정한 Bloom의 분류체계(기억, 이해, 적용, 분석, 평가, 창안)로 보여 주고, Ana의 목표가 이 수준들을 올라가는 모습과 개정판이 더한 지식 차원(사실적, 개념적, 절차적, 메타인지적)을 소개합니다. 좋은 목표가 평가와 활동을 이끈다는 점을 짚고, 같은 동사가 여러 수준에 놓일 수 있어 동사 목록은 대략적인 안내일 뿐이며, 측정하기 쉬운 목표가 중요하지만 관찰하기 어려운 목표를 밀어낼 수 있다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "A revision of Bloom's taxonomy: An overview",
        "authors": "David R. Krathwohl",
        "year": 2002,
        "url": "https://doi.org/10.1207/s15430421tip4104_2",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "Preparing instructional objectives",
        "authors": "Robert F. Mager",
        "year": 1962,
        "url": "https://hdl.handle.net/2027/mdp.39015016282587",
        "relationship": "Further reading",
        "access": "Full view · HathiTrust",
        "verificationNote": "HathiTrust record opens in full view with this title."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Mager (1962) and Anderson & Krathwohl (2001); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "task-analysis": {
    "id": "task-analysis",
    "purpose": "Use this lecture to decide whether a task can be analyzed by watching its steps or needs cognitive task analysis to surface the cues and decisions experts no longer notice they use.",
    "distinction": "Hierarchical task analysis (Annett & Duncan, 1967) decomposes a goal into subgoals with plans for their order and suits observable procedures; cognitive task analysis targets the hidden cues, decisions, and rules of thumb behind expert performance, using methods such as the critical decision method (Klein, Calderwood & MacGregor, 1989).",
    "caution": "Rosa, her mechanics, and the cases are made up. Cognitive task analysis takes time, and one expert’s account is still incomplete, so analysts often interview several experts and check the result against real performance.",
    "koSummary": "이 강의는 과제를 학습자에게 필요한 단계, 의사결정, 지식으로 나누는 과제분석과, 그것이 대부분의 설계 모형에서 초기에 오는 이유를 설명합니다. 신입 정비공을 가르치는 가상의 강사 Rosa는 타이어 교체를 John Annett과 Keith Duncan의 위계적 과제분석으로 분석합니다. 목표를 하위 목표로 나누고 그 순서를 정하는 계획을 두며, 각 단계는 관찰할 수 있습니다. 이상한 소음을 진단하는 일은 다릅니다. 전문가는 그냥 들린다고 말하며, Richard Clark과 동료들은 전문가가 자신의 일을 설명할 때 의사결정의 최대 70%를 빠뜨린 연구들을 소개합니다. 인지적 과제분석은 전문가가 알아차리는 단서, 내리는 결정, 그 뒤의 경험칙처럼 숨은 지식을 되찾으려 하며, 예컨대 Gary Klein과 동료들의 결정적 의사결정 방법(critical decision method)은 실제로 어려웠던 사례의 각 결정을 캐묻습니다. Rosa의 면담으로 드러난 단서는 연습용 녹음 자료가 됩니다. 인지적 과제분석에는 시간이 들고 한 전문가의 설명은 여전히 불완전하므로, 분석가들이 여러 전문가를 면담하고 실제 수행과 대조한다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "Critical decision method for eliciting knowledge",
        "authors": "Gary A. Klein, Roberta Calderwood, and Donald MacGregor",
        "year": 1989,
        "url": "https://doi.org/10.1109/21.31053",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Annett & Duncan (1967), Klein, Calderwood & MacGregor (1989), and Clark, Feldon, van Merriënboer, Yates & Early (2008); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "icap": {
    "id": "icap",
    "purpose": "Use this lecture to classify a learning activity by what learners overtly do, and to find a small change that would move it from passive or active toward constructive or interactive.",
    "distinction": "ICAP distinguishes passive (receiving), active (manipulating the given material), constructive (generating output beyond the material), and interactive (co-constructing with a partner who also contributes) engagement, and predicts that learning generally increases in the order I > C > A > P.",
    "caution": "Jun and his class are made up. Modes are judged from what learners actually do, not from the task design; group work in which one student explains while others copy is not interactive; and the ordering is a general prediction that single studies do not always confirm at every step.",
    "koSummary": "이 강의는 학습자가 실제로 무엇을 하는지에 따라 학습 활동을 분류하는 Michelene Chi와 Ruth Wylie의 ICAP 프레임워크를 소개합니다. 수동적(passive) 참여는 주의를 기울이며 정보를 받아들이는 것, 능동적(active) 참여는 멈추기, 밑줄 긋기, 베껴 쓰기처럼 주어진 자료 자체를 다루는 것, 구성적(constructive) 참여는 이유 설명하기, 개념도 그리기, 질문하기처럼 주어진 것을 넘어서는 무언가를 만들어 내는 것, 상호작용적(interactive) 참여는 둘 이상의 학습자가 서로의 생각 위에 생각을 쌓아 가는 것입니다. 가상의 생물 교사 Jun은 심장에 관한 같은 영상을 쓰되 과제를 네 양식에 걸쳐 바꾸고, 마지막에는 짝끼리 그림을 비교하며 서로의 오류를 고칩니다. 학습이 수동적, 능동적, 구성적, 상호작용적 순으로 증가한다는 ICAP 가설과 각 양식 뒤의 사고 과정(저장, 연결, 추론, 함께 추론)을 제시합니다. 양식은 계획된 과제가 아니라 학습자가 실제로 하는 행동으로 판단해야 하며, 한 학생이 설명하고 나머지는 베끼는 모둠 활동은 상호작용적이지 않고, 개별 연구가 모든 단계를 항상 확인하지는 않는다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "The ICAP framework: Linking cognitive engagement to active learning outcomes",
        "authors": "Michelene T. H. Chi and Ruth Wylie",
        "year": 2014,
        "url": "https://doi.org/10.1080/00461520.2014.965823",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "Active-constructive-interactive: A conceptual framework for differentiating learning activities",
        "authors": "Michelene T. H. Chi",
        "year": 2009,
        "url": "https://doi.org/10.1111/j.1756-8765.2008.01005.x",
        "relationship": "Further reading",
        "access": "Open access",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page. OpenAlex lists it as free to read on the publisher site."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Chi (2009) and Chi & Wylie (2014); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "srl": {
    "id": "srl",
    "purpose": "Use this lecture to trace one learner's study through forethought, performance, and self-reflection, and to see how the way errors are explained shapes the next round.",
    "distinction": "Zimmerman's cyclical model separates forethought (goal setting, strategic planning, and self-efficacy beliefs), performance (using strategies and self-observation, such as self-talk and error logs), and self-reflection (self-evaluation against the goal, causal attribution, and adjustment), which feeds the next forethought phase.",
    "caution": "Sofia and her course are made up. Self-regulation is not only willpower: it depends on knowing strategies and can be taught. Much of the research relies on self-report questionnaires, which do not always match what learners actually do.",
    "koSummary": "이 강의는 같은 시간 동안 공부하지만 한 명은 계획하고 점검하고 조정하며, 다른 한 명은 시간이 다 될 때까지 노트를 다시 읽기만 하는 두 학생을 대비해 자기조절학습, 곧 학습자가 자신의 학습을 스스로 이끄는 방식을 소개합니다. 약물 용량 계산을 배우는 가상의 간호학생 Sofia의 사례로 Barry Zimmerman의 세 단계 순환을 따라갑니다. 사전 숙고(forethought) 단계에서 그녀는 금요일까지 20문제를 오류 없이 푼다는 목표를 세우고, 풀이 예제 다음에 혼합 연습을 하는 전략을 계획하며, 해낼 수 있다고 믿습니다. 이 믿음이 자기효능감입니다. 수행 단계에서는 전략을 쓰면서 자신을 관찰하고, 각 단계를 말로 짚으며 모든 오류를 기록합니다. 자기성찰 단계에서는 결과를 목표와 비교하고, 오류 대부분이 단위 변환에서 나온다는 것을 찾아, 능력이 아니라 방법의 문제로 설명하고 단위 확인 단계를 추가합니다. 세 단계가 순환을 이루며, 전략을 가리키는 성찰은 바꿀 거리를 주지만 능력을 탓하는 성찰은 노력을 줄이는 경향이 있다는 점을 보여 줍니다. 자기조절은 의지력만의 문제가 아니며 가르칠 수 있고, 공부 습관에 관한 설문 응답이 실제 행동과 항상 일치하지는 않는다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "Becoming a self-regulated learner: An overview",
        "authors": "Barry J. Zimmerman",
        "year": 2002,
        "url": "https://doi.org/10.1207/s15430421tip4102_2",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "Attaining self-regulation: A social cognitive perspective",
        "authors": "Barry J. Zimmerman",
        "year": 2000,
        "url": "https://doi.org/10.1016/B978-012109890-2/50031-7",
        "relationship": "Further reading",
        "access": "Book chapter · publisher page",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher site, which showed a browser check. Chapter in the Handbook of Self-Regulation."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Zimmerman (2000) and Zimmerman (2002); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "embodied-cognition": {
    "id": "embodied-cognition",
    "purpose": "Use this lecture to judge when gesture, action, or physical objects are likely to support learning a concept, and when they are likely to distract.",
    "distinction": "Embodied (grounded) cognition holds that concepts draw on perception and action systems (Barsalou, 2008), in contrast to views in which the body only supplies input and carries out output. In instruction, the movement should be congruent with the idea it stands for, as with grouping gestures for equivalence (Goldin-Meadow, Cook & Mitchell, 2009) or acting out sentences while reading (Glenberg et al., 2004).",
    "caution": "Nora and her class are made up. Movement is not automatically helpful: incongruent movement and perceptually rich objects can distract, and concrete materials tend to help most when they fade toward symbols (Fyfe et al., 2014). How strong the embodiment claim is remains debated.",
    "koSummary": "이 강의는 많은 아이가 12나 17로 답하는 등식 문제(3 + 4 + 5 = __ + 5)와, 묶기 제스처를 배운 아이들이 수업 뒤 더 많은 문제를 풀었고 한 연구에서는 몇 주 뒤에도 그 향상을 유지했다는 Susan Goldin-Meadow와 동료들의 연구로 시작합니다. 사고가 머릿속 기호 처리만이 아니라 몸과 행동에 의해 형성된다는 체화된 인지(embodied cognition)를, 마음을 컴퓨터로 보는 관점과 Lawrence Barsalou의 근거 인지(grounded cognition)를 대비해 소개합니다. 장난감으로 이야기를 직접 재연한 어린 독자들이 다시 읽기만 한 아이들보다 이야기를 더 잘 이해하고 기억했으며, 나중에는 움직임을 상상하는 것만으로도 도움이 되었다는 Arthur Glenberg와 동료들의 연구를 보여 줍니다. 설계의 핵심으로 일치성(congruence), 곧 움직임이 그것이 나타내는 개념과 맞아야 한다는 점을 Robb Lindgren과 동료들의 전신 소행성 시뮬레이션과, 등호를 팔로 만든 저울로 보여 주는 가상의 교사 Nora로 설명합니다. 움직임이 저절로 도움이 되지는 않으며, 개념과 맞지 않는 움직임이나 주의를 끄는 화려한 사물은 방해가 될 수 있고, 구체물은 점차 기호로 옮겨 갈 때(concreteness fading) 가장 도움이 되는 경향이 있으며, 모든 사고가 신체적이라는 강한 주장은 여전히 논쟁 중이라는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "Gesturing gives children new ideas about math",
        "authors": "Susan Goldin-Meadow, Susan Wagner Cook, and Zachary A. Mitchell",
        "year": 2009,
        "url": "https://doi.org/10.1111/j.1467-9280.2009.02297.x",
        "relationship": "Further reading",
        "access": "Paywalled · open copy in PubMed Central",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher site, which showed a browser check. OpenAlex lists a PubMed Central copy."
      },
      {
        "title": "Grounded cognition",
        "authors": "Lawrence W. Barsalou",
        "year": 2008,
        "url": "https://doi.org/10.1146/annurev.psych.59.103006.093639",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "Enhancing learning and engagement through embodied interaction within a mixed reality simulation",
        "authors": "Robb Lindgren, Michael Tscholl, Shuai Wang, and Emily Johnson",
        "year": 2016,
        "url": "https://doi.org/10.1016/j.compedu.2016.01.001",
        "relationship": "Further reading",
        "access": "Open access",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher site, which showed a browser check. OpenAlex lists it as free to read on the publisher site."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Goldin-Meadow, Cook & Mitchell (2009), Cook, Mitchell & Goldin-Meadow (2008), Barsalou (2008), Glenberg et al. (2004), Lindgren et al. (2016), and Fyfe et al. (2014); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "computational-thinking": {
    "id": "computational-thinking",
    "purpose": "Use this lecture to name the computational-thinking practices in a learning task and to see concepts, practices, and perspectives as separate things to teach and assess.",
    "distinction": "Many school frameworks describe computational thinking through decomposition, pattern recognition, abstraction, and algorithms (after Wing, 2006). Brennan and Resnick (2012) instead describe three dimensions: computational concepts (such as loops and conditionals), practices (such as testing and debugging, reusing, abstracting), and perspectives (such as seeing oneself as able to create with computing).",
    "caution": "Kai and his game are made up. Definitions of computational thinking vary, so studies often measure different things, and evidence that it improves general problem solving beyond computing is limited so far.",
    "koSummary": "이 강의는 고양이가 떨어지는 물고기를 잡는 게임을 만들고 싶은 가상의 6학년 학생 Kai를 따라가며, Jeannette Wing이 2006년에 프로그래머만이 아니라 모든 사람의 기술이라고 주장한 컴퓨팅 사고(computational thinking)를 소개합니다. 많은 학교 프레임워크가 꼽는 네 가지 실천을 차례로 보여 줍니다. 분해(decomposition)는 게임을 움직이는 고양이, 떨어지는 물고기, 점수로 나누는 것이고, 패턴 인식은 모든 물고기가 같은 방식으로 움직이므로 하나의 명령 집합으로 모두를 다룰 수 있음을 알아차리는 것이며, 추상화는 색은 버리고 위치와 속도만 남기는 것, 알고리즘은 \"계속 아래로 이동하고, 고양이에 닿으면 점수를 1 더하고 맨 위로 돌아간다\"처럼 정확한 순서의 단계입니다. 놓친 물고기가 바닥에 머무는 버그를 찾아 단계를 추가하는 테스트와 디버깅도 보여 줍니다. Karen Brennan과 Mitchel Resnick의 세 차원인 개념, 실천, 관점을 제시합니다. 합의된 단일 정의가 없어 연구마다 측정하는 것이 다르고, 컴퓨팅을 넘어 일반적인 문제 해결력이 향상된다는 기대에는 아직 근거가 제한적이라는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "Computational thinking",
        "authors": "Jeannette M. Wing",
        "year": 2006,
        "url": "https://doi.org/10.1145/1118178.1118215",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "New frameworks for studying and assessing the development of computational thinking",
        "authors": "Karen Brennan and Mitchel Resnick",
        "year": 2012,
        "url": "https://scratched.gse.harvard.edu/ct/files/AERA2012.pdf",
        "relationship": "Further reading",
        "access": "Open access",
        "verificationNote": "AERA 2012 paper; the PDF link opens. Not indexed in Crossref."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Wing (2006) and Brennan & Resnick (2012); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "constructionism": {
    "id": "constructionism",
    "purpose": "Use this lecture to tell constructionism apart from constructivism and to judge when a making activity is likely to carry the idea you want learners to meet.",
    "distinction": "Constructivism (Piaget) describes learners building knowledge structures in their own minds. Constructionism (Papert, 1980; Papert & Harel, 1991) adds that this happens especially well when learners are building a public artifact that others can see and question, often with objects to think with such as the Logo turtle. Design aims include a low floor, a high ceiling, and wide walls (Resnick et al., 2009).",
    "caution": "Maya and her turtle are made up. Making without guidance can leave the big idea unnoticed, and early Logo studies found little transfer to general planning skills (Pea & Kurland, 1984), so making is often paired with talk and reflection.",
    "koSummary": "이 강의는 화면 속 거북이에게 정사각형을 그리게 하기 전에 바닥에서 직접 정사각형을 걸어 보는 가상의 4학년 학생 Maya를 따라가며 Seymour Papert의 구성주의(constructionism)를 소개합니다. 학습자는 빈 항아리처럼 채워지는 존재가 아니라 자기 머릿속에서 지식을 짓는다는 Jean Piaget의 구성주의(constructivism)와, 여기에 더해 프로그램이나 기계, 이야기처럼 다른 사람이 보고 쓰고 질문할 수 있는 무언가를 세상에 만들 때 학습이 특히 잘 일어난다는 Papert의 생각을 대비합니다. Maya가 원을 걸어 본 뒤 작은 걸음과 작은 회전을 반복하는 반복문을 쓰는 장면으로, 생각의 도구(object to think with)로서의 Logo 거북이와 몸과 맞닿은 학습(body syntonic learning)을 보여 줍니다. 한쪽으로 쏠린 꽃 그림을 틀린 답이 아니라 찾아서 고칠 수 있는 버그로 다루며, 이것이 자기 생각에 대해 생각해 보는 기회가 된다는 점을 보여 줍니다. 낮은 바닥, 높은 천장, 넓은 벽이라는 설계 목표와 Mitchel Resnick 연구팀의 Scratch, 그리고 Resnick의 네 가지 P(프로젝트, 열정, 동료, 놀이)를 제시합니다. 만들기만으로 학습이 보장되지는 않으며, 초기 Logo 연구에서 일반적인 계획 능력으로의 전이가 거의 나타나지 않아 오늘날 많은 교사가 만들기에 대화와 성찰을 함께 짝짓는다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "Scratch: Programming for all",
        "authors": "Mitchel Resnick, John Maloney, Andrés Monroy-Hernández, and colleagues",
        "year": 2009,
        "url": "https://doi.org/10.1145/1592761.1592779",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "On the cognitive effects of learning computer programming",
        "authors": "Roy D. Pea and D. Midian Kurland",
        "year": 1984,
        "url": "https://doi.org/10.1016/0732-118X(84)90018-7",
        "relationship": "Further reading",
        "access": "Paywalled · open repository copy listed",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher site, which showed a browser check. OpenAlex lists an open repository copy."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Papert (1980), Papert & Harel (1991), Resnick et al. (2009), and Pea & Kurland (1984); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "scaffolding-zpd": {
    "id": "scaffolding-zpd",
    "purpose": "Use this lecture to design help that fits what a learner shows right now and to plan when and how that help fades.",
    "distinction": "The zone of proximal development (Vygotsky, 1978) describes where help makes a difference; scaffolding (Wood, Bruner & Ross, 1976) names the help itself. Van de Pol, Volman, and Beishuizen (2010) identify three features of scaffolding: contingency, fading, and transfer of responsibility. A contingent rule is to give more help after a failure and less after a success (Wood, Wood & Middleton, 1978).",
    "caution": "Leo and his tutor are made up. The word scaffolding is often stretched to mean any help; support that never fades is not scaffolding. The zone is not a fixed property of a learner and changes with the task and with who is helping.",
    "koSummary": "이 강의는 두 단계 문장제를 아직 혼자서는 풀지 못하지만 튜터의 좋은 질문 몇 개가 있으면 풀 수 있는 가상의 아홉 살 아이 Leo로 시작해, 혼자 할 수 있는 것과 도움을 받아 할 수 있는 것 사이의 간격인 Lev Vygotsky의 근접발달영역(zone of proximal development)을 소개합니다. 근접발달영역 아래의 과제는 이미 쉽고, 위의 과제는 도움을 받아도 닿지 않으며, 오늘 도움을 받아 할 수 있는 것을 내일은 혼자 할 수 있는 경우가 많다는 점을 보여 줍니다. 어린아이들이 나무 블록으로 피라미드를 쌓도록 튜터가 돕는 장면을 관찰해 그 도움에 스캐폴딩(scaffolding)이라는 이름을 붙인 David Wood, Jerome Bruner, Gail Ross의 1976년 연구와, 흥미 끌기, 과제 단순화, 목표 유지, 중요한 것 짚어 주기, 좌절 달래기, 시범 보이기라는 튜터의 여섯 가지 행동을 제시합니다. Janneke van de Pol과 동료들이 꼽은 세 가지 특징인 수반성(contingency), 점진적 철회(fading), 책임 이양(transfer of responsibility)을 설명하고, 실패하면 도움을 늘리고 성공하면 줄인다는 규칙을 보여 줍니다. 프롬프트, 문장 시작 틀, 소프트웨어 힌트처럼 도구에 담긴 스캐폴드는 학습자를 볼 수 없어 도움이 너무 많거나 너무 적을 수 있다는 점도 다룹니다. 스캐폴딩이라는 말이 흔히 모든 도움을 가리키는 데 쓰이지만 사라지지 않는 도움은 지원일 뿐 스캐폴딩이 아니며, 근접발달영역은 고정된 점수가 아니라 과제와 돕는 사람에 따라 달라진다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "The role of tutoring in problem solving",
        "authors": "David Wood, Jerome S. Bruner, and Gail Ross",
        "year": 1976,
        "url": "https://doi.org/10.1111/j.1469-7610.1976.tb00381.x",
        "relationship": "Further reading",
        "access": "Open access",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page. OpenAlex lists it as free to read on the publisher site."
      },
      {
        "title": "Scaffolding in teacher–student interaction: A decade of research",
        "authors": "Janneke van de Pol, Monique Volman, and Jos Beishuizen",
        "year": 2010,
        "url": "https://doi.org/10.1007/s10648-010-9127-6",
        "relationship": "Further reading",
        "access": "Open access",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Vygotsky (1978), Wood, Bruner & Ross (1976), van de Pol, Volman & Beishuizen (2010), and Wood, Wood & Middleton (1978); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "cognitive-load": {
    "id": "cognitive-load",
    "purpose": "Use this lecture to find extraneous load in your materials and to decide when worked examples help and when they should fade.",
    "distinction": "Intrinsic load depends on how many interacting elements a task has for a given learner; extraneous load depends on how the material is presented (Sweller, 1988; Sweller, 2010). Worked examples help novices (Sweller & Cooper, 1985), faded examples bridge to problem solving (Renkl & Atkinson, 2003), and the benefit can reverse as expertise grows (Kalyuga, Ayres, Chandler & Sweller, 2003).",
    "caution": "Ana and her equations are made up. Cognitive load is hard to measure directly and is often rated by learners on a short scale (Paas, 1992). Most evidence comes from well-structured tasks such as math and science problems.",
    "koSummary": "이 강의는 처음 만난 방정식을 시행착오로 풀었지만 어떻게 풀었는지 설명하지 못하는 가상의 9학년 학생 Ana로 시작해, 작업기억은 한 번에 몇 개의 새로운 항목만 다룰 수 있는 반면 장기기억은 방대한 스키마를 담을 수 있다는 John Sweller의 인지부하이론(cognitive load theory)을 소개합니다. 과제에서 함께 다뤄야 하는 요소의 수에서 오는 내재적 부하(intrinsic load)와, 배우지 않으면서 애쓰게 만드는 설계에서 오는 외재적 부하(extraneous load)를 구분하고, 스키마를 짓는 노력을 가리키던 본유적 부하(germane load)는 이론의 최신 버전에서 내재적 부하에 포함된다는 점을 짚습니다. 시행착오식 탐색이 작업기억을 소모하기 때문에 초보자는 같은 문제를 스스로 풀 때보다 풀이된 문제를 공부할 때 더 많이 배우는 경우가 많다는 풀이 예제 효과(worked example effect)와, 풀이 예제와 비슷한 문제를 짝짓고 단계를 하나씩 줄여 가는 순서를 제시합니다. 도표와 그 이름표가 멀리 떨어져 있을 때 생기는 주의 분산 효과(split attention)와, 화면의 글을 그대로 소리 내어 읽는 것처럼 같은 정보를 두 번 줄 때 생기는 중복 효과(redundancy)도 보여 줍니다. 실력이 늘면 풀이 예제가 오히려 방해가 될 수 있어 안내를 줄여야 한다는 전문성 역전 효과(expertise reversal effect)를 설명합니다. 인지부하는 직접 측정하기 어려워 짧은 자기 평정에 기대는 경우가 많고, 근거의 대부분이 수학과 과학 문제처럼 구조가 잘 짜인 과제에서 나왔다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "The use of worked examples as a substitute for problem solving in learning algebra",
        "authors": "John Sweller and Graham A. Cooper",
        "year": 1985,
        "url": "https://doi.org/10.1207/s1532690xci0201_3",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "The expertise reversal effect",
        "authors": "Slava Kalyuga, Paul Ayres, Paul Chandler, and John Sweller",
        "year": 2003,
        "url": "https://doi.org/10.1207/S15326985EP3801_4",
        "relationship": "Further reading",
        "access": "Paywalled · open repository copy listed",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page. OpenAlex lists an open repository copy."
      },
      {
        "title": "Element interactivity and intrinsic, extraneous, and germane cognitive load",
        "authors": "John Sweller",
        "year": 2010,
        "url": "https://doi.org/10.1007/s10648-010-9128-5",
        "relationship": "Further reading",
        "access": "Paywalled · open repository copy listed",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page. OpenAlex lists an open repository copy."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Sweller (1988), Sweller (2010), Sweller & Cooper (1985), Renkl & Atkinson (2003), Kalyuga, Ayres, Chandler & Sweller (2003), and Paas (1992); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "situated-learning": {
    "id": "situated-learning",
    "purpose": "Use this lecture to see learning as growing participation in a practice and to find real but low-risk first tasks for newcomers.",
    "distinction": "Legitimate peripheral participation (Lave & Wenger, 1991) describes how newcomers move from small, real tasks at the edge of a practice toward full participation. Situated cognition (Brown, Collins & Duguid, 1989) holds that knowledge is shaped by the activity and setting in which it is used. A community of practice combines a domain, a community, and a shared practice (Wenger, 1998; Wenger, McDermott & Snyder, 2002).",
    "caution": "Ravi is made up. Communities can keep newcomers at the edge and can pass on poor practice as well as good. The theory is stronger at describing learning than at giving direct rules for designing instruction.",
    "koSummary": "이 강의는 새로 온 견습생이 천을 자르는 일부터가 아니라 단추 달기와 완성된 옷 다림질처럼 공정의 끝에서부터 시작하는 재단사 작업장으로 문을 열며, 라이베리아의 견습 재단사에 대한 Jean Lave의 연구를 바탕으로 합니다. 학습은 머릿속에서만 일어나는 일이 아니라 공동체의 실천에 참여해 그 일원이 되어 가는 것이라는 Lave와 Etienne Wenger의 주장과 '합법적 주변 참여(legitimate peripheral participation)'라는 개념을 소개합니다. 신참의 일은 실제로 쓰이고 인정받는 일이며(합법적), 실수의 대가가 적은 가장자리의 작은 일에서 시작해(주변적) 점차 중심으로 옮겨 가고, 실수하면 천을 망치는 재단은 가장 마지막에 맡게 됩니다. 지식은 그것이 배워지고 쓰이는 활동과 맥락에 의해 형성되며 학교 과제는 그 맥락을 걷어 내기 쉽다는 John Seely Brown, Allan Collins, Paul Duguid의 1989년 주장도 제시합니다. 공유된 영역, 함께 배우는 공동체, 이야기와 도구와 일하는 방식으로 이루어진 실천을 공유하는 Wenger의 실천공동체(communities of practice)를 설명하고, 숙련된 간호사들 곁에서 일하며 병동의 요령과 불문율을 익히는 가상의 신입 간호사 Ravi를 통해 학습이 지켜보는 사람에서 속한 사람으로 바뀌는 정체성의 변화이기도 하다는 점을 보여 줍니다. 공동체가 신참을 가장자리에 묶어 둘 수 있고 좋은 습관만큼 나쁜 습관도 쉽게 전할 수 있으며, 이 이론은 학습을 잘 설명하지만 수업 설계를 위한 직접적인 규칙은 적게 준다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "Situated learning: Legitimate peripheral participation",
        "authors": "Jean Lave and Etienne Wenger",
        "year": 1991,
        "url": "https://doi.org/10.1017/CBO9780511815355",
        "relationship": "Further reading",
        "access": "Book · publisher page",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "Situated cognition and the culture of learning",
        "authors": "John Seely Brown, Allan Collins, and Paul Duguid",
        "year": 1989,
        "url": "https://doi.org/10.3102/0013189X018001032",
        "relationship": "Further reading",
        "access": "Paywalled · open repository copy listed",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page. OpenAlex lists an open repository copy."
      },
      {
        "title": "Communities of practice: Learning, meaning, and identity",
        "authors": "Etienne Wenger",
        "year": 1998,
        "url": "https://doi.org/10.1017/CBO9780511803932",
        "relationship": "Further reading",
        "access": "Book · publisher page",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Lave & Wenger (1991), Brown, Collins & Duguid (1989), Wenger (1998), and Wenger, McDermott & Snyder (2002); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "distributed-cognition": {
    "id": "distributed-cognition",
    "purpose": "Use this lecture to look at a learning task as a system of people, tools, and representations, and to decide what each learner should still be able to do alone.",
    "distinction": "Distributed cognition (Hutchins, 1995; Hollan, Hutchins & Kirsh, 2000) takes a system of people and artifacts, not one head, as the unit of analysis, and notes that tools change the task rather than only amplifying the person. Pea (1993) drew design implications for education. Salomon, Perkins, and Globerson (1991) separated effects with a technology (performance while using it) from effects of a technology (what remains without it).",
    "caution": "Mia, Jon, and Lena are made up. When a system carries the work, individuals may learn little, and most assessments remove the tools. Because the unit of analysis is large, much of the research is careful description rather than controlled experiments.",
    "koSummary": "이 강의는 착륙 전 조종사들이 적정 속도를 그냥 외우는 대신 카드에서 찾아 소리 내어 말하고 속도계 둘레에 스피드 버그라는 작은 표시를 꽂아 두는 조종석 장면으로 시작해, 기억이 한 사람의 머릿속이 아니라 승무원, 카드, 계기에 걸쳐 퍼져 있다는 Edwin Hutchins의 분산인지(distributed cognition)를 소개합니다. 선원 두 명이 지형지물의 방위를 재고, 한 명이 기록하고, 플로터가 해도에 선을 그어 어느 한 사람도 전체 계산을 하지 않는 해군 함정의 항해팀에 대한 Hutchins의 연구를 보여 줍니다. 스피드 버그를 꽂아 두면 조종사가 숫자를 읽고 비교하는 대신 바늘이 표시를 가리키는지만 확인하면 되듯 도구는 과제 자체를 바꾼다는 점을 설명하고, 사람들 사이, 마음과 사물 사이, 그리고 이전의 작업이 오늘의 도구에 담기는 시간에 걸쳐 인지가 퍼진다는 James Hollan, Hutchins, David Kirsh의 세 가지 분산을 제시합니다. 공유 화이트보드가 누구도 혼자 기억할 수 없는 것을 담아 주는 가상의 실험 모둠, 학습자가 도구와 함께 그리고 서로 함께 생각하는 연습을 해야 한다는 Roy Pea의 주장, 도구를 쓰는 동안의 효과(effects with)와 도구를 치웠을 때 남는 효과(effects of)를 구분한 Gavriel Salomon과 동료들의 질문이 AI 도구 시대에 다시 중요해졌다는 점을 다룹니다. 시스템이 일을 대신하면 개인은 거의 배우지 못할 수 있고 대부분의 시험은 도구를 치우며, 분석 단위가 커서 연구가 실험보다는 꼼꼼한 기술(description)인 경우가 많다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "Cognition in the wild",
        "authors": "Edwin Hutchins",
        "year": 1995,
        "url": "https://doi.org/10.7551/mitpress/1881.001.0001",
        "relationship": "Further reading",
        "access": "Book · publisher page",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher site, which showed a browser check."
      },
      {
        "title": "Distributed cognition: Toward a new foundation for human-computer interaction research",
        "authors": "James Hollan, Edwin Hutchins, and David Kirsh",
        "year": 2000,
        "url": "https://doi.org/10.1145/353485.353487",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "Partners in cognition: Extending human intelligence with intelligent technologies",
        "authors": "Gavriel Salomon, David N. Perkins, and Tamar Globerson",
        "year": 1991,
        "url": "https://doi.org/10.3102/0013189X020003002",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Hutchins (1995), Hollan, Hutchins & Kirsh (2000), Pea (1993), and Salomon, Perkins & Globerson (1991); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "learning-engineering": {
    "id": "learning-engineering",
    "purpose": "Use this lecture to frame course improvement as an iterative, team-based cycle that applies learning science and checks its effects with data.",
    "distinction": "Learning engineering, in the IEEE ICICLE description, is a process and practice that applies the learning sciences using human-centered engineering design methodologies and data-informed decision making to support learners. Simon (1967) first called for learning engineers. The work is commonly described as a repeating cycle of challenge, creation, implementation, and investigation.",
    "caution": "Dana and her course are made up. Logged clicks are not the same as learning, and what is easy to measure is not always what matters. Collecting and using learner data carries obligations of privacy, consent, and fairness across groups.",
    "koSummary": "이 강의는 매주 수천 명의 학생이 공부하고 그들이 밟는 모든 단계가 기록되는 온라인 대수 강좌를 운영하는 팀으로 시작해, 그 데이터를 강좌 개선에 어떻게 써야 하는지 묻습니다. 1967년 Herbert Simon이 엔지니어가 물리학을 적용하듯 학습과학을 설계에 적용하는 러닝 엔지니어가 대학에 필요하다고 주장한 데서 그 기원을 찾습니다. 러닝 엔지니어링을 인간 중심 공학 설계와 데이터 기반 의사결정을 통해 학습과학을 적용해 학습자를 지원하는 과정이자 실천으로 보는 IEEE 러닝 엔지니어링 커뮤니티의 설명을 제시합니다. 이 작업을 과제 정의, 설계·제작, 실행, 조사로 이어지고 다시 시작되는 순환으로 보여 줍니다. 한 연습 세트에서 많은 학생이 그만두는 이유가 힌트가 답을 너무 일찍 알려 주기 때문임을 발견하고, 힌트를 다시 설계해 작은 실험을 돌린 뒤 더 많은 학생이 끝까지 하는지와 다음 퀴즈 성적이 나아지는지를 함께 확인하는 가상의 러닝 엔지니어 Dana를 따라갑니다. 러닝 엔지니어링은 교사, 설계자, 데이터 과학자, 학습자 자신이 함께하는 팀 작업이라고 설명합니다. 클릭은 학습이 아니고 기록하기 쉬운 것이 늘 중요한 것은 아니며, 학습자 데이터에는 개인정보 보호, 동의, 집단 간 공정성이라는 책임이 따른다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "Learning engineering toolkit: Evidence-based practices from the learning sciences, instructional design, and beyond",
        "authors": "Jim Goodell and Janet Kolodner (Eds.)",
        "year": 2022,
        "url": "https://doi.org/10.4324/9781003276579",
        "relationship": "Further reading",
        "access": "Open access",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page. OpenAlex lists the book as open access."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Simon (1967) and the IEEE ICICLE description of learning engineering; further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "knowledge-components": {
    "id": "knowledge-components",
    "purpose": "Use this lecture to break a task into knowledge components, read learning curves, and spot when one label hides two skills.",
    "distinction": "The Knowledge-Learning-Instruction framework (Koedinger, Corbett & Perfetti, 2012) describes learning as the acquisition of knowledge components. A knowledge component model, or Q matrix, maps task steps to components; learning curves plot error rate against practice opportunities for each component, and a smooth decline suggests a good model. DataShop in LearnSphere supports comparing such models.",
    "caution": "The tutor and its curves are made up. Components are inferred from data, several models can fit equally well, and skills that do not appear as discrete steps, such as explaining or designing, are hard to model this way.",
    "koSummary": "이 강의는 연습할수록 대부분의 오류 곡선이 내려가지만 한 곡선만 평평하게 남는 기하 튜터로 시작해 그 이유를 묻습니다. 원의 넓이 구하기처럼 학습자가 한 단계에서 쓰는 작은 기술이나 지식 단위인 지식 요소(knowledge component)로 학습을 설명하는 Kenneth Koedinger, Albert Corbett, Charles Perfetti의 관점을 소개합니다. 과제의 각 단계에 필요한 지식 요소를 표시하는 지도, 곧 지식 요소 모형 또는 Q 행렬을 보여 줍니다. 한 지식 요소의 오류율을 연습 기회에 따라 그리면, 좋은 모형은 처음에 빠르게 그리고 점차 느리게 내려가는 매끄러운 학습 곡선을 보인다는 점을 설명합니다. 가상의 예에서 울퉁불퉁한 곡선을 단서로, 원의 넓이를 단독으로 구하는 것과 더 큰 도형 안에서 구하는 것이 사실 두 개의 지식 요소였음을 찾아내고, 이를 나누자 두 곡선이 매끄러워지며 예측도 좋아지는 과정을 보여 주고, DataShop 같은 공개 도구로 모형을 비교할 수 있다고 덧붙입니다. 계속 어려운 요소에는 연습을 더 주고 이미 숙달한 요소는 줄이는 식으로 모형이 연습 설계를 안내한다는 점도 다룹니다. 지식 요소는 관찰이 아니라 추론된 것이고 여러 모형이 같은 데이터에 맞을 수 있으며, 설명하기나 설계하기처럼 깔끔한 단계로 드러나지 않는 기술은 이런 방식으로 포착하기 어렵다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "The Knowledge-Learning-Instruction framework: Bridging the science-practice chasm to enhance robust student learning",
        "authors": "Kenneth R. Koedinger, Albert T. Corbett, and Charles Perfetti",
        "year": 2012,
        "url": "https://doi.org/10.1111/j.1551-6709.2012.01245.x",
        "relationship": "Further reading",
        "access": "Paywalled · open repository copy listed",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page. OpenAlex lists an open repository copy."
      },
      {
        "title": "Human-machine student model discovery and improvement using DataShop",
        "authors": "John C. Stamper and Kenneth R. Koedinger",
        "year": 2011,
        "url": "https://doi.org/10.1007/978-3-642-21869-9_46",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Koedinger, Corbett & Perfetti (2012) and DataShop; further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "intelligent-tutoring": {
    "id": "intelligent-tutoring",
    "purpose": "Use this lecture to describe what an intelligent tutor does inside and across problems, and to judge claims about tutoring systems, including chat-based ones.",
    "distinction": "Intelligent tutoring systems have an inner loop (step-level feedback and hints within a problem) and an outer loop (task selection across problems) (VanLehn, 2006). Model tracing matches student steps to a cognitive model of expert steps (Anderson, Corbett, Koedinger & Pelletier, 1995). In VanLehn's (2011) review, step-based tutoring systems (effect size about 0.76) were nearly as effective as human tutoring (about 0.79) relative to no tutoring.",
    "caution": "Omar and his tutor are made up. Tutors are expensive to author for each domain, students may game the system by abusing hints (Baker, Corbett, Koedinger & Wagner, 2004), and fluent chat from language models still needs testing for accurate step-level feedback.",
    "koSummary": "이 강의는 튜터링 시스템이 어떤 올바른 풀이 경로에도 맞지 않는 단계를 곧바로 표시하고 힌트를 건네는 가상의 학생 Omar를 따라가며, 학습자마다 맞춘 단계별 안내를 주는 지능형 튜터링 시스템(intelligent tutoring systems)을 소개합니다. Kurt VanLehn이 말한 두 개의 고리를 제시합니다. 내부 고리는 한 문제 안에서 각 단계에 피드백을 주고 요청하면 가벼운 귀띔부터 다음 단계 전체까지 힌트를 주며, 외부 고리는 문제와 문제 사이에서 각 기술의 숙달 시점을 추정해 다음에 무엇을 연습할지 고릅니다. 전문가가 밟을 수 있는 단계 모형에 학생의 각 단계를 맞춰 보는 모형 추적(model tracing)을 John Anderson과 동료들의 Cognitive Tutor를 예로 설명하고, 제약 조건을 검사하거나 풀이 예제를 따르거나 자연어 대화를 나누는 튜터도 있다고 짚습니다. 단계 기반 튜터링 시스템이 인간 튜터에 거의 맞먹을 만큼 효과적이었고 둘 다 튜터링이 없을 때보다 분명히 나았다는 VanLehn의 2011년 리뷰를 전하며, 대규모 언어 모델의 유창한 대화가 정확한 단계별 피드백과 같지 않아 여전히 검증이 필요하다고 말합니다. 튜터는 영역마다 만드는 비용이 크고, 힌트가 너무 쉽게 나오면 일부 학생이 힌트를 계속 눌러 답에 도달하는 식으로 시스템을 악용(gaming the system)한다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "The relative effectiveness of human tutoring, intelligent tutoring systems, and other tutoring systems",
        "authors": "Kurt VanLehn",
        "year": 2011,
        "url": "https://doi.org/10.1080/00461520.2011.611369",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "Cognitive tutors: Lessons learned",
        "authors": "John R. Anderson, Albert T. Corbett, Kenneth R. Koedinger, and Ray Pelletier",
        "year": 1995,
        "url": "https://doi.org/10.1207/s15327809jls0402_2",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "Off-task behavior in the cognitive tutor classroom: When students \"game the system\"",
        "authors": "Ryan S. Baker, Albert T. Corbett, Kenneth R. Koedinger, and Angela Z. Wagner",
        "year": 2004,
        "url": "https://doi.org/10.1145/985692.985741",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names VanLehn (2006), Anderson, Corbett, Koedinger & Pelletier (1995), VanLehn (2011), and Baker, Corbett, Koedinger & Wagner (2004); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "edm-learning-analytics": {
    "id": "edm-learning-analytics",
    "purpose": "Use this lecture to tell educational data mining and learning analytics apart, name their common methods, and judge a prediction by the action it supports.",
    "distinction": "Siemens and Baker (2012) contrast educational data mining, which emphasizes automated discovery and modeling, with learning analytics, which emphasizes human judgment and use of data in context. Common methods include prediction, clustering, relationship mining, and discovery with models (Baker & Yacef, 2009). Early-warning systems such as Course Signals (Arnold & Pistilli, 2012) show that the value of a prediction depends on the intervention it triggers.",
    "caution": "Sam and his team are made up. Course Signals' reported retention effects were later questioned. Predictive models can reproduce historical inequities and should be checked across groups, learners should be told what is collected and why, and click data are a thin trace of learning.",
    "koSummary": "이 강의는 일부 1학년 학생이 3주차쯤 강좌에 접속하지 않게 되는 것을 알아챈 대학으로 시작해, 데이터가 이들을 제때 찾아낼 수 있는지, 그다음엔 무엇을 해야 하는지 묻습니다. 둘 다 학습 데이터를 다루지만 George Siemens와 Ryan Baker가 말하듯 강조점이 다른 두 연구 공동체, 교육 데이터 마이닝(educational data mining)과 학습 분석(learning analytics)을 소개합니다. 교육 데이터 마이닝은 누가 어려움을 겪을지, 어떤 단계에 어떤 기술이 필요한지 예측하는 모형을 만드는 것처럼 자동화된 방법에 기울고, 학습 분석은 교사와 학습자를 위한 대시보드나 맥락 속의 의사결정처럼 데이터를 쓰는 사람에 기울며, 실제로는 둘이 겹친다고 설명합니다. 예측, 군집화, 관계 마이닝, 그리고 한 모형의 결과가 다음 연구의 입력이 되는 모형을 이용한 발견(discovery with models) 같은 대표적인 방법을 제시합니다. 접속이 줄어든 학생을 모형이 표시하면 상담자가 연락하는 가상의 Sam 팀을 따라가며, 예측만으로는 아무것도 바뀌지 않고 그 예측이 어떤 행동으로 이어지며 그 행동이 실제로 도움이 되는지가 중요하다고 강조합니다. 초기의 잘 알려진 시스템인 퍼듀 대학의 Course Signals가 보고한 학업 지속률 향상이 나중에 의문을 받았다는 점도 짚습니다. 과거 학생으로 학습한 모형은 과거의 불공정을 이어받을 수 있으므로 집단마다 얼마나 잘 맞는지 확인해야 하고, 학습자는 무엇이 왜 수집되는지 알 권리가 있으며, 클릭은 학습의 희미한 흔적일 뿐이라는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "Learning analytics and educational data mining: Towards communication and collaboration",
        "authors": "George Siemens and Ryan S. J. d. Baker",
        "year": 2012,
        "url": "https://doi.org/10.1145/2330601.2330661",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "The state of educational data mining in 2009: A review and future visions",
        "authors": "Ryan S. J. d. Baker and Kalina Yacef",
        "year": 2009,
        "url": "https://jedm.educationaldatamining.org/index.php/JEDM/article/view/8",
        "relationship": "Further reading",
        "access": "Open access",
        "verificationNote": "Journal of Educational Data Mining article page opens with this title."
      },
      {
        "title": "Course Signals at Purdue: Using learning analytics to increase student success",
        "authors": "Kimberly E. Arnold and Matthew D. Pistilli",
        "year": 2012,
        "url": "https://doi.org/10.1145/2330601.2330666",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Siemens & Baker (2012), Baker & Yacef (2009), and Arnold & Pistilli (2012); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "learning-experiments": {
    "id": "learning-experiments",
    "purpose": "Use this lecture to plan a fair randomized comparison inside a learning platform, from the outcome measure to the unit of randomization.",
    "distinction": "Random assignment makes groups comparable on average, so outcome differences can be attributed to the version. Platforms such as ASSISTments support randomized studies within authentic homework (Heffernan & Heffernan, 2014). Randomizing within classes risks contamination; randomizing whole classes avoids it but needs more clusters. Immediate performance and delayed learning can diverge.",
    "caution": "Priya and her team are made up. All versions should be defensible instruction, studies require ethical review and notice to learners, small effects need large samples and preplanned analyses, and an average effect can mask subgroups for whom a version is worse.",
    "koSummary": "이 강의는 풀이 단계 하나를 보여 주는 힌트와 질문을 던지는 힌트, 두 가지 숙제 힌트 중 어느 쪽이 더 도움이 되는지 추측하는 대신 플랫폼에서 둘 다 시험해 볼 수 있다는 장면으로 시작합니다. A/B 테스트에서는 학생마다 한 버전에 무작위로 배정되기 때문에 두 집단이 평균적으로 비슷해지고, 결과의 차이를 버전의 차이로 돌릴 수 있다고 설명합니다. ASSISTments 같은 플랫폼에서는 실제 학생과 실제 내용으로 이루어진 실제 숙제 안에서 무작위 연구를 할 수 있다는 점을 짚습니다. 클릭 수나 학습 시간만이 아니라 이후 문제 수행이나 지연 시험처럼 학습을 보여 주는 결과 지표를 먼저 정해야 한다고 강조합니다. 한 반 안에서 학생 단위로 무작위 배정하면 비용은 적지만 친구끼리 이야기하며 버전이 섞일 수 있고, 반 전체를 배정하면 이를 막을 수 있지만 훨씬 많은 반이 필요하며, 효과가 작은 경우가 많아 많은 학생이 필요하고 데이터를 보기 전에 분석 방법을 정해야 한다는 점을 보여 줍니다. 질문형 힌트가 바로 다음 문제에서는 이겼지만 일주일 뒤 지연 시험에서는 차이가 없었던 가상의 Priya 팀을 통해, 지금의 수행을 돕는 것이 나중의 학습을 돕는 것과 다를 수 있다는 흔한 패턴을 보여 줍니다. 어느 버전이든 가르치는 방법으로서 타당해야 하고, 연구에는 윤리 심의와 학습자에 대한 명확한 안내가 필요하며, 평균 효과가 어떤 집단에서는 오히려 나빠지는 결과를 가릴 수 있다는 점을 주의점으로 둡니다.",
    "sources": [
      {
        "title": "The ASSISTments ecosystem: Building a platform that brings scientists and teachers together for minimally invasive research on human learning and teaching",
        "authors": "Neil T. Heffernan and Cristina Lindquist Heffernan",
        "year": 2014,
        "url": "https://doi.org/10.1007/s40593-014-0024-x",
        "relationship": "Further reading",
        "access": "Open access",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page. OpenAlex lists it as open access."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names ASSISTments (Heffernan & Heffernan, 2014); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "multilevel-basic": {
    "id": "multilevel-basic",
    "purpose": "Use this lecture to check whether an analysis matches the level at which a treatment was assigned, and to read the intraclass correlation, the design effect, and a multilevel model in plain terms.",
    "distinction": "When treatment is assigned to clusters such as classes, the cluster is the unit of assignment and analysis should respect it. The intraclass correlation is the share of score variance that lies between clusters; the design effect, 1 + (m - 1) x ICC for clusters of size m, gives how much clustering shrinks the effective sample. Multilevel (hierarchical linear) models estimate between-cluster variance, partially pool cluster estimates toward the overall mean, and can let slopes vary by cluster (Raudenbush & Bryk, 2002).",
    "caution": "The study, classes, scores, and numbers are made up. A multilevel model gives honest standard errors for nested data but does not add information: with three classes per group the treatment comparison stays very uncertain, and variance estimates themselves are unstable with few clusters.",
    "koSummary": "이 강의는 튜터링 앱을 세 학급에 주고 다른 세 학급을 비교군으로 둔, 학급당 20명인 가상의 연구로 시작해, 학생 120명을 각각 따로 분석하면 연구가 보여 줄 수 있는 것보다 결과를 부풀리게 되는 이유를 보여 줍니다. 같은 학급 학생들은 교사와 일정, 서로를 공유하므로 점수가 함께 움직이기 때문입니다. 분석 단위는 처치가 배정된 수준에 맞춰야 하므로 이 연구의 단위는 학생 120명이 아니라 학급 6개입니다. 점수의 변동을 학급 간 차이와 학급 내 차이로 나누어 급내상관(intraclass correlation)을 정의하고, 급내상관 0.2를 설계 효과(design effect) 4.8로 바꾸어 학생 120명이 독립된 학생 약 25명만큼의 정보를 지닌다는 점을 계산합니다. 이어 다층 모형(multilevel model)이 이 위계 구조를 분석에 반영하고, 학급 사이에서 정보를 빌려 작은 학급의 추정치를 전체 평균 쪽으로 당기며, 기울기가 학급마다 다를 수 있게 한다는 점을 보여 줍니다. 마지막으로 모형은 설계가 모으지 않은 정보를 만들어 낼 수 없으므로, 학급 단위로 처치를 배정하는 연구에는 많은 학급이 필요하다고 강조합니다.",
    "sources": [
      {
        "title": "Intraclass correlation values for planning group-randomized trials in education",
        "authors": "Larry V. Hedges and E. C. Hedberg",
        "year": 2007,
        "url": "https://doi.org/10.3102/0162373707299706",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "Hierarchical linear models: Applications and data analysis methods (2nd ed.)",
        "authors": "Stephen W. Raudenbush and Anthony S. Bryk",
        "year": 2002,
        "url": "https://us.sagepub.com/en-us/nam/hierarchical-linear-models/book9230",
        "relationship": "Further reading",
        "access": "Book · publisher page",
        "verificationNote": "Publisher page opens with this title. Not indexed in Crossref."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names no sources on screen; the guide cites Raudenbush & Bryk (2002); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "formative-feedback": {
    "id": "formative-feedback",
    "purpose": "Use this lecture to tell formative from summative uses of assessment, plan a feedback move, and check whether learners get a chance to act on it.",
    "distinction": "Assessment is formative when evidence is used to adapt teaching and learning (Black & Wiliam, 1998). Wiliam and Thompson (2007) describe five key strategies. Hattie and Timperley (2007) model feedback as answering where am I going, how am I going, and where to next, at the task, process, self-regulation, or self level; feedback about the self is least effective. Kluger and DeNisi (1996) found that over a third of feedback interventions lowered performance.",
    "caution": "Rosa and her class are made up. Feedback effects vary widely and can be negative; grades given with comments can draw attention away from the comments, and feedback that learners have no time or chance to use does little.",
    "koSummary": "이 강의는 분수 퀴즈를 채점해 각 장에 점수를 적고 곧바로 소수 단원으로 넘어가는 가상의 교사 Rosa로 시작해, 그 퀴즈가 학습에 무엇을 해 주었는지 묻습니다. 학습에 대한 증거를 아직 손쓸 시간이 있을 때 가르침과 배움을 조정하는 데 쓰면 그 평가는 형성적(formative)이라고 정의하고, 이 실천을 강화하면 성취가 높아진다는 Paul Black과 Dylan Wiliam의 1998년 리뷰를 소개합니다. Wiliam의 다섯 가지 전략, 곧 목표와 성공 기준을 분명히 하기, 학생의 생각을 끌어내기, 학습을 앞으로 나아가게 하는 피드백 주기, 학생을 서로의 자원으로 삼기, 학생이 자기 학습의 주인이 되게 하기를 정리합니다. John Hattie와 Helen Timperley를 따라 좋은 피드백을 세 질문(어디로 가는가, 어떻게 가고 있는가, 다음은 어디인가)과 네 수준(과제, 과정, 자기조절, 자기 자신)으로 설명하고, 사람 자체에 대한 칭찬은 효과가 가장 작다고 짚습니다. Avraham Kluger와 Angelo DeNisi가 검토한 사례의 3분의 1 이상에서 피드백이 수행을 오히려 떨어뜨렸다는 점도 다룹니다. 끝으로 Rosa가 답안을 분류해 많은 학생이 분모끼리 더한다는 것을 찾아내고, 다음 날 그 오류로 수업을 시작해 학생들이 체크리스트로 자기 답을 고치게 하는 장면으로 돌아갑니다.",
    "sources": [
      {
        "title": "Assessment and classroom learning",
        "authors": "Paul Black and Dylan Wiliam",
        "year": 1998,
        "url": "https://doi.org/10.1080/0969595980050102",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "The power of feedback",
        "authors": "John Hattie and Helen Timperley",
        "year": 2007,
        "url": "https://doi.org/10.3102/003465430298487",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "The effects of feedback interventions on performance: A historical review, a meta-analysis, and a preliminary feedback intervention theory",
        "authors": "Avraham N. Kluger and Angelo DeNisi",
        "year": 1996,
        "url": "https://doi.org/10.1037/0033-2909.119.2.254",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Black & Wiliam (1998), Wiliam & Thompson (2007), Hattie & Timperley (2007), and Kluger & DeNisi (1996); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "validity-argument": {
    "id": "validity-argument",
    "purpose": "Use this lecture to state what a score is supposed to mean and support, lay out the inferences behind that use, and find the link with the least evidence.",
    "distinction": "Validity is the degree to which evidence and theory support the interpretations of test scores for proposed uses (AERA, APA & NCME, 2014). Messick (1989) treated validity as a unified evaluative judgment that includes the consequences of score use. Kane (2013) frames validation as evaluating an interpretation/use argument built from inferences such as scoring, generalization, extrapolation, and decision. The Standards list five sources of evidence: content, response processes, internal structure, relations to other variables, and consequences.",
    "caution": "Tom and his test are made up. A score can be well supported for one use and poorly supported for another, and a high reliability coefficient supports the generalization inference only, not the whole argument.",
    "koSummary": "이 강의는 짧은 읽기 시험으로 신입생을 보충 과정에 배치하는 대학으로 시작해, 그 시험이 타당한지 묻습니다. 그런데 이 질문은 조금 빗나가 있습니다. 교육·심리 검사 표준(Standards)은 타당도를 시험의 속성이 아니라, 주어진 용도에 대해 점수의 해석을 증거와 이론이 얼마나 잘 뒷받침하는지로 정의하기 때문입니다. 여기에 타당도는 점수 사용의 결과까지 포함하는 하나의 통합된 판단이라는 Samuel Messick의 관점을 더합니다. 이어 Michael Kane의 논증 기반 접근을 하나하나 점검할 수 있는 추론의 사슬로 펼칩니다. 채점, 다른 문항지·채점자·날짜로의 일반화, 실제 수업의 읽기로의 외삽, 그리고 학생을 배치하는 결정입니다. 각 고리가 기댈 수 있는 증거의 원천으로 시험 내용, 응답 과정, 내적 구조, 다른 측정치와의 관계, 결과를 듭니다. 끝으로 가상의 연구자 Tom이 점수는 일관되지만 배치된 학생이 배치되지 않은 비슷한 학생보다 나아지지 않았음을 발견해, 결정 고리가 약하므로 대학이 점수 사용 방식을 고치는 장면을 보여 줍니다.",
    "sources": [
      {
        "title": "Validating the interpretations and uses of test scores",
        "authors": "Michael T. Kane",
        "year": 2013,
        "url": "https://doi.org/10.1111/jedm.12000",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "Validity of psychological assessment: Validation of inferences from persons’ responses and performances as scientific inquiry into score meaning",
        "authors": "Samuel Messick",
        "year": 1995,
        "url": "https://doi.org/10.1037/0003-066X.50.9.741",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page. A shorter statement of the unified view than the 1989 chapter named in the video."
      },
      {
        "title": "Standards for educational and psychological testing",
        "authors": "American Educational Research Association, American Psychological Association, and National Council on Measurement in Education",
        "year": 2014,
        "url": "https://www.testingstandards.net/open-access-files.html",
        "relationship": "Further reading",
        "access": "Open access",
        "verificationNote": "Open-access files page of the Standards opens with this title."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names the AERA, APA & NCME Standards (2014), Messick (1989), and Kane (2013); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "stealth-assessment": {
    "id": "stealth-assessment",
    "purpose": "Use this lecture to plan how gameplay can serve as assessment evidence, and to check that the evidence model, not only the game, has been tested.",
    "distinction": "Stealth assessment embeds evidence-centered design in a game so that assessment runs during play without interrupting it (Shute, 2011). Evidence-centered design links a competency model, evidence models, and task models (Mislevy, Steinberg & Almond, 2003); Bayesian networks are a common way to update competency estimates from observed actions. Physics Playground is a well-known example whose estimates have been compared with external physics tests.",
    "caution": "Mia and her levels are made up. Hidden assessment should not be secret: learners and teachers should know what is measured and why. Game actions also reflect familiarity with the game, so evidence rules need validation, and building a stealth assessment takes substantial design work.",
    "koSummary": "이 강의는 물리 게임에서 경사로와 지렛대를 그려 공을 풍선까지 보내는 가상의 플레이어 Mia로 시작합니다. 퀴즈는 한 번도 나오지 않는데, 게임이 Mia가 무엇을 이해하는지 알 수 있을지 묻습니다. 플레이를 끊지 않을 만큼 게임 속에 촘촘히 짜 넣은 평가인 Valerie Shute의 스텔스 평가(stealth assessment)를 소개하고, 이를 증거 중심 설계(evidence-centered design)에 기대어 설명합니다. 알고 싶은 것을 정하는 역량 모형, 어떤 행동이 얼마나 강한 증거인지 정하는 증거 모형, 그 역량을 보여 줄 기회를 주는 레벨을 정하는 과제 모형입니다. 행동 하나하나가 흔히 베이지안 네트워크(Bayesian network) 안에서 추정치를 갱신하는 모습을 보여 주는데, 지렛대로 레벨을 풀면 토크에 대한 증거가 되고, 경사로 레벨에서 여러 번 다시 시작하면 빈틈을 가리킬 수 있습니다. Shute와 동료들이 이런 방식으로 Physics Playground를 만들고 게임의 추정치를 일반 물리 시험과 견주어 확인했다는 점도 다룹니다. 추정치가 힌트, 새 레벨, 교사용 보고서를 이끌 수 있음을 보여 준 뒤, 지렛대를 피해 토크 추정치가 불확실하게 남은 Mia에게 게임이 지렛대가 필요한 레벨을 내미는 장면으로 돌아갑니다.",
    "sources": [
      {
        "title": "Stealth assessment in computer-based games to support learning",
        "authors": "Valerie J. Shute",
        "year": 2011,
        "url": "https://doi.org/10.1108/978-1-61735-410-620251025",
        "relationship": "Further reading",
        "access": "Book chapter · publisher page",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher site, which showed a browser check. Chapter in Computer Games and Instruction (Tobias & Fletcher, Eds.)."
      },
      {
        "title": "On the structure of educational assessments",
        "authors": "Robert J. Mislevy, Linda S. Steinberg, and Russell G. Almond",
        "year": 2003,
        "url": "https://doi.org/10.1207/S15366359MEA0101_02",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "Assessment and learning of qualitative physics in Newton's Playground",
        "authors": "Valerie J. Shute, Matthew Ventura, and Yoon Jeon Kim",
        "year": 2013,
        "url": "https://doi.org/10.1080/00220671.2013.832970",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page. Newton’s Playground is the earlier name of Physics Playground."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Shute (2011), Mislevy, Steinberg & Almond (2003), and Physics Playground; further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  },
  "mastery-learning": {
    "id": "mastery-learning",
    "purpose": "Use this lecture to describe the mastery learning cycle, read the two sigma claim with its later evidence, and plan where time and help could vary in a course.",
    "distinction": "Carroll's (1963) model treats learning as a function of time spent relative to time needed. Bloom (1968) proposed mastery learning: formative tests, correctives, enrichment, and parallel second tests. Bloom (1984) reported that one-to-one tutoring with mastery procedures produced about a two standard deviation advantage. Kulik, Kulik and Bangert-Drowns (1990) found an average effect of about 0.5 SD for mastery learning programs; tutoring systems often use knowledge tracing to decide mastery.",
    "caution": "Ben and his class are made up. The two sigma figure came from small, short studies and has not been matched at scale; correctives need time that schedules may not have, fast learners can end up waiting, mastery cutoffs are judgment calls, and passing a short test does not show retention.",
    "koSummary": "이 강의는 시간은 고정되고 학습 결과는 제각각인 흔한 교실로 시작합니다. 모두가 분수에 2주를 쓰고, 준비가 되었든 안 되었든 다음 단원으로 넘어갑니다. 이어 John Carroll의 학교 학습 모형을 바탕으로 1968년 Benjamin Bloom이 제안한 완전학습(mastery learning)을 소개합니다. 학습을 고정하고 시간과 도움을 달리하는 접근입니다. 단원을 가르치고, 짧은 형성평가를 보고, 숙달 기준에 이른 학생은 심화 활동으로, 나머지는 교정 학습으로 보낸 뒤, 다음 단원 전에 평행 검사를 한 번 더 보는 순환을 따라갑니다. 숙달 확인을 곁들여 일대일로 튜터링을 받은 학생이 일반 학급보다 약 2 표준편차 높은 점수를 받아, 평균적인 튜터링 학생이 그 학급의 98퍼센트보다 잘했다는 Bloom의 1984년 보고와, 집단 수업이 감당할 만한 비용으로 이에 얼마나 가까이 갈 수 있는가라는 2 시그마 문제(two sigma problem)를 다룹니다. 이후 리뷰들은 효과가 더 작지만 실재한다고 보았는데, 1990년의 완전학습 프로그램 리뷰에서는 평균 약 0.5 표준편차였고, 2 시그마 연구 상당수는 작고 짧았습니다. 지식 추적으로 숙달을 판단하는 지능형 튜터로 이 생각을 이어 간 뒤, 소그룹 교정 학습으로 남은 3분의 1 학생 대부분을 숙달에 이르게 하는 가상의 교사 Ben을 따라갑니다.",
    "sources": [
      {
        "title": "The 2 sigma problem: The search for methods of group instruction as effective as one-to-one tutoring",
        "authors": "Benjamin S. Bloom",
        "year": 1984,
        "url": "https://doi.org/10.3102/0013189X013006004",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "Effectiveness of mastery learning programs: A meta-analysis",
        "authors": "Chen-Lin C. Kulik, James A. Kulik, and Robert L. Bangert-Drowns",
        "year": 1990,
        "url": "https://doi.org/10.3102/00346543060002265",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      },
      {
        "title": "A model of school learning",
        "authors": "John B. Carroll",
        "year": 1963,
        "url": "https://doi.org/10.1177/016146816306400801",
        "relationship": "Further reading",
        "access": "Abstract · full text paywalled",
        "verificationNote": "Crossref record matched (title, authors, year); DOI resolves to the publisher page."
      }
    ],
    "verificationNote": "Caption-based editorial guide. The video names Carroll (1963), Bloom (1968), Bloom (1984), and Kulik, Kulik & Bangert-Drowns (1990); further-reading links were checked against Crossref, OpenAlex, and the linked pages on 2026-10-30.",
    "reviewedAt": "2026-10-30"
  }
};

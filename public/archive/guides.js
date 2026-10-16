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
  }
};

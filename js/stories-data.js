/*
  STORIES DATA
  ============
  To add a new story: copy an entry below, give it a unique "id" (no spaces),
  fill in the fields, and add it to the STORIES array. New entries can go
  anywhere in the array — the site sorts by date automatically, newest first.

  Fields:
    id        - unique url-safe slug, e.g. "jane-doe-hyles-anderson"
    title     - story title
    author    - display name or "Anonymous"
    date      - "YYYY-MM-DD", used for sorting
    tags      - short array of labels, e.g. ["Hyles-Anderson", "Deputation"]
    excerpt   - 1-2 sentence summary shown on cards (plain text)
    body      - array of paragraphs (plain text, no HTML needed)
    sample    - set to true only for placeholder/demo entries. Leave false
                (or remove the field) for real stories.
*/

const STORIES = [
  {
    id: "thirty-years-one-letter-at-a-time",
    title: "Thirty Years, One Letter at a Time",
    author: "Anonymous",
    date: "2026-07-29",
    tags: ["Legalism", "Spiritual Abuse", "Family Estrangement", "Narcissistic Pastor", "Faith After"],
    excerpt: "A husband and wife raised in the IFB describe over thirty years under a pastor whose control over their family reached the point of editing the letters he sent to his own parents, and the years it took to recognize it.",
    body: [
      `For more than thirty years, my husband and I sincerely believed we were faithfully following God. Looking back, we now realize we had slowly confused devotion to Christ with loyalty to spiritual leaders.`,
      `This is the story of how God patiently led us out of fear, legalism, and control, and into the freedom of knowing Him for ourselves.`,
      `This is not a deconstruction story. We never stopped loving God. We simply had to rediscover Him apart from the version of faith we had been taught through years of legalism and spiritual control.`,
      `My husband and I were both raised in the IFB, though our experiences were different. My parents were never particularly strict, but I grew up attending church three times a week, along with conferences, revivals, and every other church event. My husband's parents served on staff at another IFB church led by a pastor who often told people, "If you want to know God's will, just come ask me and I'll tell you." At the time, I thought the Baptists who wore skirts all the time were the extreme ones. Because my own upbringing was comparatively lenient, I didn't recognize legalism for the danger it could become. My husband and I remained in that environment for more than 30 years.`,
      `The Pastor and Our Experience`,
      `During his years as a missionary in Southeast Asia, many of his presentations focused on demon possession and spiritual warfare. He frequently showed disturbing slides from Hindu festivals and told stories that emphasized spiritual darkness. At the time, I simply assumed he had witnessed extraordinary things overseas. Looking back, I realize that his emphasis on spirits would eventually influence much of his teaching and counseling.`,
      `When he became our pastor, much of the influence within the church came through both him and his wife. They frequently described themselves as victims of conflicts with others, and his wife spent countless hours on the phone with women in the church.`,
      `What made it so difficult to recognize was that many of the expectations weren't preached from the pulpit. If the pastor had stood up on Sunday morning and declared, "Christians shouldn't celebrate Christmas," or "Women shouldn't wear shorts," those would have been obvious red flags. Instead, those ideas spread quietly through private conversations. During long phone calls, the pastor's wife would discuss what a "godly" woman looked like or how a truly committed Christian should live. They weren't usually presented as rules or demands. They were framed as the natural choices a mature believer would make. Over time, I watched families, including members of my own extended family, gradually adopt increasingly restrictive standards. It happened so subtly that most of us never realized we were being influenced. Looking back, those private conversations shaped the culture of the church far more than many of the sermons ever did, and the divisions they created continue to affect relationships today.`,
      `As the years passed, our church became increasingly isolated from other IFB churches we had once associated with. Guest speakers were rare. There were no deacons, elders, or trustees providing meaningful accountability. My father had been elected church treasurer, but after he questioned certain financial decisions, he was removed from that position and replaced without a congregational vote.`,
      `The heart of our story began when my in-laws moved to Texas and started attending our church. At first, everything seemed fine. They had previously left another unhealthy IFB church and began noticing warning signs that we completely missed.`,
      `His preaching often relied on isolated Bible verses rather than teaching passages in context. Nearly every sermon included stories that portrayed him as someone who enjoyed a uniquely close relationship with God.`,
      `I was in my early twenties and trusted him completely.`,
      `We complied.`,
      `When my husband's parents decided to leave the church, we were told that if they wanted reconciliation, they needed to come back and apologize. They did exactly that.`,
      `Instead, we were told their apology was not genuine.`,
      `From that point on, the explanation shifted from what they had done to who they supposedly were spiritually. We were led to believe they were under negative spiritual influence and that maintaining a close relationship with them could harm us spiritually. Looking back, it felt as though the standard for reconciliation kept changing. No matter what they did, it was never enough.`,
      `Because we trusted our pastor completely, we accepted what we were told. We believed that distancing ourselves from my husband's parents was an act of obedience to God and, somehow, the most loving thing we could do for them.`,
      `That continued for years.`,
      `When I became pregnant in 2004, we were instructed not to tell my husband's parents. It is still painful to write those words. Looking back, I am deeply grieved by the choices we made while believing we were honoring God. They never held their granddaughter as a baby. I remember shutting the door when they came bearing birthday gifts. I wasn't angry with them. I loved them deeply. But Scripture had been presented to us in a way that convinced us this was the loving thing to do.`,
      `We sent letters and text messages telling them they needed to make things right with the church. Many of those messages were reviewed before they were sent. Today I realize they had done nothing that justified the separation we believed was necessary.`,
      `Years later, after my husband's parents had returned to Florida, they occasionally invited us to dinner whenever they were back in Texas. We cautiously accepted those invitations and slowly began rebuilding a relationship. Even then, we still believed they might be under spiritual influence and remained guarded.`,
      `My father passed away from COVID in late 2021, and our daughter graduated in 2022. Looking back, those two milestones marked the beginning of a new season in my life.`,
      `Losing my dad changed something deep inside me. As long as he was alive, I still thought of myself as his daughter. He had always been a steady, loving presence, someone I could turn to for wisdom and encouragement. When he was gone, I realized I couldn't keep leaning on other people to tell me what was true. I had to take ownership of my own faith.`,
      `Ironically, years earlier, when my father had questioned financial decisions at the church, I had been encouraged to doubt his spiritual judgment instead of considering his concerns. I didn't recognize it at the time, but I had slowly learned to trust church leadership more than the people who loved me most.`,
      `As I began reading Scripture for myself and paying closer attention to what I was seeing, I believe God gently started opening my eyes. I began noticing a growing gap between what we were taught and what was actually being lived out. Those observations didn't change everything overnight, but they planted seeds that God faithfully nurtured in the months that followed.`,
      `My first real breakthrough came while watching Shiny Happy People in 2023. For the first time, I realized that many of the rules we had accepted as biblical were actually expressions of legalism. The expectations surrounding modesty, holidays, and countless other issues had become measures of spirituality, even when they weren't clearly taught from Scripture.`,
      `Although we had begun recognizing the legalism, we still hadn't fully understood how deeply fear and control had shaped our thinking.`,
      `A few weeks later, before a planned trip to Florida, we were asked to meet with the pastor. He wanted to know whether we intended to spend time with my husband's parents. We admitted we would.`,
      `For the first time, both of us recognized the pressure and manipulation we were experiencing while it was happening.`,
      `During that meeting, our former pastor pulled out letters we had written to my husband's parents nearly twenty years earlier. At first, I simply recognized them as letters we had sent during one of the most painful seasons of our lives. Then I looked more closely.`,
      `The letters had been edited before we sent them. Words had been crossed out, different phrases suggested, and changes made to better reflect what we had been instructed to say. We had believed we were expressing our own convictions, but in that moment I realized how much of our thinking had been shaped for us.`,
      `As he used those same letters to convince us once again that my husband's parents could not be trusted, I wasn't seeing proof that they were wrong. I was seeing evidence of how completely we had surrendered our own judgment.`,
      `We walked out of that meeting with a question neither of us could ignore anymore: Had we slowly placed one man's authority above our own relationship with God?`,
      `That trip changed everything.`,
      `While spending time with my husband's parents, my husband and I realized we had both been quietly asking ourselves the same question: What if it was time to start over?`,
      `For the first time in years, we felt peace instead of fear.`,
      `By that point, I knew we needed to leave, but I was terrified. For years, I had been taught, both directly and indirectly, that stepping outside the pastor's authority meant stepping outside of God's protection. I wasn't afraid of the pastor himself. I was afraid of what God might do to me if I disobeyed him.`,
      `One day, as I poured those fears out to the Lord, one simple truth settled deeply into my heart: Put your trust in God, not in man.`,
      `The peace was immediate.`,
      `As I continued praying, God gently showed me something else. For years, I had been giving credit to my pastor for things that God had done. I had confused God's faithfulness with one man's leadership. The more I reflected on it, the more I realized that God had been the One faithfully guiding, protecting, providing for, and caring for us all along.`,
      `Then God began dealing with something even deeper in my own heart.`,
      `He lovingly convicted me of how judgmental I had become. For years, I had been taught to evaluate nearly everyone by whether they measured up to our particular standards and beliefs. I didn't realize how heavy that burden had become until God lifted it. For the first time in years, I found myself simply loving people instead of constantly evaluating them. I no longer felt responsible for deciding whether someone's walk with God looked exactly like mine. That freedom changed me in ways I am still grateful for today.`,
      `Those truths broke the fear that had controlled me for so many years.`,
      `In December 2023, we spent Christmas with my husband's parents for the first time in more than twenty years. We apologized for the years we had lost and tried to explain what had happened. It was a joyful reunion, and it marked the beginning of healing.`,
      `When we decided to move to Florida to be closer to my husband's aging parents, we informed the pastor out of respect. His response was immediate. He told us he would pray against our decision. During a Wednesday evening service in March 2024, we were publicly criticized, warned that God's judgment would follow us, and pressured to reconsider.`,
      `By then, however, fear no longer held the same power.`,
      `That was our last service.`,
      `We moved to Florida anyway, and my mother chose to leave with us. Watching her reclaim her own walk with God was another reminder that faith was never meant to be lived through someone else's authority. Each of us had to learn to seek the Lord for ourselves.`,
      `Leaving was painful. Although we found freedom, we also experienced profound loss. Some relationships have never recovered, and there are family members we continue to love deeply despite the distance that remains. One of the greatest heartbreaks for me is my sister. We once shared not only a family but also the same church life, and today we barely speak. I still love her deeply and pray that one day our relationship can be restored.`,
      `After leaving, we began hearing from other former members whose experiences echoed many of our own. Every story was different, but the patterns were strikingly similar. Those conversations reminded us that we weren't alone and that what we had experienced wasn't unique.`,
      `We are not sharing our story because we want revenge or because we have abandoned our faith. Quite the opposite.`,
      `Leaving that environment didn't lead us away from God, it led us back to Him. We rediscovered a relationship with Christ that was no longer defined by fear, shame, or the approval of another person.`,
      `Today, we are living with a freedom we never imagined possible. God has taught us to trust Him instead of man, to love people instead of judging them, and to rest in His grace instead of constantly striving to measure up. We are still healing, and we still carry grief over relationships that have been lost, but we have also experienced a peace and joy that we never knew while living under fear.`,
      `If someone reading our story recognizes even a small part of their own experience, our hope is that they will know they are not alone. Ask questions. Read Scripture for yourself. Trust that God is not threatened by an honest search for truth. Healthy spiritual leadership will always point people to Christ, not to itself.`,
      `If sharing our story helps even one person find that freedom, then every difficult word has been worth writing.`
    ]
  }
];

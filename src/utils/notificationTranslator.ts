export function translateNotificationTitle(title: string, t: any): string {
  if (!title) return title;
  const cleanTitle = title.toLowerCase().trim();

  if (cleanTitle.includes("mission completed") || cleanTitle.includes("મિશન પૂર્ણ કર્યું")) return t('notif_title_mission_completed', 'Mission Completed! 🎯');
  if (cleanTitle.includes("daily progress report") || cleanTitle.includes("progress report") || cleanTitle.includes("દૈનિક પ્રગતિ રિપોર્ટ")) {
    const nameMatch = title.match(/(?:Daily Progress Report|દૈનિક પ્રગતિ રિપોર્ટ):\s*([^\s🌌]+)/i);
    const name = nameMatch ? nameMatch[1] : '';
    const prefix = t('notif_title_daily_progress_report', 'Daily Progress Report 📊');
    return name ? `${prefix}: ${name}` : prefix;
  }
  if (cleanTitle.includes("daily reward claimed") || cleanTitle.includes("દૈનિક ઈનામ મળ્યું")) return t('notif_title_daily_reward_claimed', 'Daily Reward Claimed! 🎁');
  if (cleanTitle.includes("daily habit complete")) return t('notif_title_daily_habit_complete', 'Daily Habit Complete! 🌟');
  if (cleanTitle.includes("daily habit skipped")) return t('notif_title_daily_habit_skipped', 'Daily Habit Skipped');
  if (cleanTitle.includes("chapter read pdf completed")) return t('notif_title_chapter_pdf_completed', 'Chapter Read PDF Completed! 📖');
  if (cleanTitle.includes("mystery solved") || cleanTitle.includes("mission solved") || cleanTitle.includes("કોયડો ઉકેલાયો")) return t('notif_title_mystery_solved', '🧩 MYSTERY SOLVED!');
  if (cleanTitle.includes("shadow arena defeat") || cleanTitle.includes("shadow defeat")) return t('notif_title_shadow_defeat', '⚔️ SHADOW ARENA DEFEAT');
  if (cleanTitle.includes("shadow arena champion") || cleanTitle.includes("shadow champion")) return t('notif_title_shadow_champion', '🏆 SHADOW CHAMPION!');
  if (cleanTitle.includes("shadow arena emergency") || cleanTitle.includes("શેડો એરેના કટોકટી") || cleanTitle.includes("શેડો એરેના ઈમરજન્સી")) return t('notif_title_shadow_arena_emergency', '⚔️ SHADOW ARENA EMERGENCY!');

  if (cleanTitle.includes("boss conquered")) return t('notif_title_boss_conquered', '🌋 BOSS CONQUERED!');
  if (cleanTitle.includes("streak emergency")) return t('notif_title_streak_emergency', '🔥 STREAK EMERGENCY!');
  if (cleanTitle.includes("streak in danger")) return t('notif_title_streak_danger', '💔 STREAK IN DANGER!');
  if (cleanTitle.includes("freezing")) return t('notif_title_dragon_freezing', '⚠️ YOUR DRAGON IS FREEZING! 🧊');
  if (cleanTitle.includes("unclaimed treasure")) return t('notif_title_unclaimed_treasure', '📦 UNCLAIMED TREASURE!');
  if (cleanTitle.includes("free spin")) return t('notif_title_free_spin_ready', '🌀 FREE SPIN READY!');
  if (cleanTitle.includes("cracking alert")) return t('notif_title_cracking_alert', '🥚 CRACKING ALERT!');
  if (cleanTitle.includes("sunday scholar")) return t('notif_title_sunday_scholar_test', '📝 SUNDAY SCHOLAR TEST LIVE!');
  if (cleanTitle.includes("habit time")) return t('notif_title_habit_time', '🌟 HABIT TIME!');
  if (cleanTitle.includes("needs attention") || cleanTitle.includes("attention needed") || cleanTitle.includes("ધ્યાન આપવાની જરૂર છે")) return t('notif_title_needs_attention', 'Attention Needed ⚠️');
  if (cleanTitle.includes("outstanding performance")) return t('notif_title_outstanding_performance', 'Outstanding Performance! 🌟');
  if (cleanTitle.includes("exam revision")) return t('notif_title_exam_revision', 'Exam Revision Time! ⏰');
  if (cleanTitle.includes("superparent alert")) return t('notif_title_superparent_alert', '👑 Superparent Alert!');
  if (cleanTitle.includes("friendly duel alert")) return t('notif_title_friendly_duel', '⚔️ Friendly Duel Alert!');
  if (cleanTitle.includes("major milestone")) return t('notif_title_major_milestone', '🎉 Major Milestone!');
  if (cleanTitle.includes("revenge battle")) return t('notif_title_revenge_battle', '🛡️ REVENGE BATTLE!');

  const sanitizedKey = cleanTitle.replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, '_');
  return t(sanitizedKey, { defaultValue: title });
}

export function translateNotificationMessage(msg: string, t: any): string {
  if (!msg) return msg;
  let translated = msg;

  // 1. Child Mission Completed with Rewards
  const childMissionMatch = translated.match(/^(.*?)\s+(?:just\s+)?completed a daily mission and earned rewards!/i) || translated.match(/^(.*?)\s+એ હમણાં જ દૈનિક મિશન પૂર્ણ કર્યું અને ઈનામો જીત્યા!/i);
  if (childMissionMatch) {
    const child = childMissionMatch[1];
    return t('notif_msg_child_mission_completed', { child, defaultValue: `${child} just completed a daily mission and earned rewards!` });
  }
  if (/completed a daily mission/i.test(translated) || /completed a mission and earned rewards/i.test(translated)) {
    return t('notif_msg_mission_completed_rewards', 'You just completed a daily mission and earned rewards!');
  }

  // 2. Child or Self Daily Habit Completed / Skipped
  const childHabitMatch = translated.match(/^(.*?)\s+(?:just\s+)?completed (?:their|your) daily habit(?: and earned rewards!)?/i);
  if (childHabitMatch && childHabitMatch[1].toLowerCase() !== 'you') {
    const child = childHabitMatch[1];
    return t('notif_msg_child_daily_habit_completed', { child, defaultValue: `${child} just completed their daily habit and earned rewards!` });
  }
  if (/daily habit and earned rewards/i.test(translated) || /completed (their|your) daily habit/i.test(translated)) {
    return t('notif_msg_daily_habit_completed', 'You completed your daily habit and earned rewards!');
  }
  if (/skipped (their|your) daily habit/i.test(translated)) {
    return t('notif_msg_daily_habit_skipped', 'You skipped your daily habit today. Encourage them to try tomorrow!');
  }

  // 3. Shadow Arena Defeated / Lost (Child or Self)
  const childShadowLostMatch = translated.match(/^(.*?)\s+(?:fought hard but lost to|lost to)\s*'?(.*?)'?\s*in (?:the\s+)?Shadow Arena/i);
  if (childShadowLostMatch && childShadowLostMatch[1].toLowerCase() !== 'you') {
    const child = childShadowLostMatch[1];
    const opponent = childShadowLostMatch[2];
    return t('notif_msg_child_shadow_lost', { child, opponent, defaultValue: `${child} fought hard but lost to '${opponent}' in the Shadow Arena.` });
  }
  if (/lost to '?(.*?)'? in the Shadow Arena/i.test(translated) || /defeated by '?(.*?)'? in Shadow Arena/i.test(translated)) {
    const match = translated.match(/lost to '?(.*?)'? in the Shadow Arena/i) || translated.match(/defeated by '?(.*?)'? in Shadow Arena/i);
    const opp = match ? match[1] : "opponent";
    return t('notif_msg_shadow_defeated_by', { opponent: opp, defaultValue: `You fought hard but lost to '${opp}' in the Shadow Arena.` });
  }

  // 4. Daily Progress Report Message
  if (/daily report for today/i.test(translated) || /Study Time:/i.test(translated)) {
    const timeMatch = translated.match(/Study Time:\s*([\d\w\s]+?)(?:🎯|📈|Great|$)/i);
    const qMatch = translated.match(/Questions Solved:\s*(\d+)/i);
    const scoreMatch = translated.match(/Confidence Score:\s*(\d+%\s*[^!\.]*)/i);
    const nameMatch = translated.match(/Here is (?:(.*?)’s|(.*?)\s+)?daily report for today/i);
    const child = nameMatch ? (nameMatch[1] || nameMatch[2] || '').trim() : '';
    const time = timeMatch ? timeMatch[1].trim() : '6 mins';
    const questions = qMatch ? qMatch[1] : '27';
    const confidence = scoreMatch ? scoreMatch[1].trim() : '89%';
    if (child) {
      return t('notif_msg_daily_report_full_child', { child, time, questions, confidence, defaultValue: `Good evening! 🌌 Here is ${child}'s daily report for today: ⏱️ Study Time: ${time} 🎯 Questions Solved: ${questions} 📈 Confidence Score: ${confidence} Great job today! Rest well and see you tomorrow! 🚀` });
    }
    return t('notif_msg_daily_report_full', { time, questions, confidence, defaultValue: `Good evening! 🌌 Here is your daily report for today: ⏱️ Study Time: ${time} 🎯 Questions Solved: ${questions} 📈 Confidence Score: ${confidence} Great job today! Rest well and see you tomorrow! 🚀` });
  }

  // 5. 1v1 Challenge Duel
  if (/challenged you to a 1v1 duel/i.test(translated) || /fight back/i.test(translated)) {
    return t('notif_msg_1v1_challenge', "A classmate just challenged you to a 1v1 duel! Don't let your trophy slip away. Tap to fight back! 🔥");
  }

  // 6. Spin Wheel Reward
  const spinMatch = translated.match(/You won (.+) from the spin wheel!/i);
  if (spinMatch) {
    const rawReward = spinMatch[1];
    let rewardText = rawReward;

    if (/(\d+)\s*Coins/i.test(rawReward)) {
      const count = rawReward.match(/(\d+)/)?.[1] || '';
      rewardText = t('count_coins', { count, defaultValue: `${count} Coins` });
    } else if (/(\d+)\s*XP/i.test(rawReward)) {
      const count = rawReward.match(/(\d+)/)?.[1] || '';
      rewardText = t('count_xp', { count, defaultValue: `${count} XP` });
    } else if (/Rare Box/i.test(rawReward)) {
      rewardText = t('rare_box', 'Rare Box');
    } else if (/Epic Box/i.test(rawReward)) {
      rewardText = t('epic_box', 'Epic Box');
    } else if (/Common Box/i.test(rawReward)) {
      rewardText = t('common_box', 'Common Box');
    } else {
      const key = rawReward.toLowerCase().replace(/ /g, '_');
      rewardText = t(key, { defaultValue: rawReward });
    }

    return t('notif_msg_spin_reward_won', { reward: rewardText, defaultValue: `You won ${rewardText} from the spin wheel!` });
  }

  // 7. Exam Alert
  const examMatch = translated.match(/Exam is coming up in (\d+) days/i);
  if (examMatch) {
    const days = examMatch[1];
    return t('notif_msg_exam_coming_up', { days, defaultValue: `Exam is coming up in ${days} days! We've prepared a special revision challenge.` });
  }

  // 8. Performance Struggling / Weak Alert
  const strugglingMatch = translated.match(/(.+) is struggling in '(.*?): (.*?)'/i);
  if (strugglingMatch) {
    const child = strugglingMatch[1];
    const subject = strugglingMatch[2];
    const chapter = strugglingMatch[3];
    return t('notif_msg_struggling_detail', { child, subject, chapter, defaultValue: `${child} is struggling in '${subject}: ${chapter}'. Let's practice more to master this!` });
  }
  if (/struggling|struggles in the recent chapter/i.test(translated)) {
    return t('notif_msg_weakness_alert', "We noticed some struggles in the recent chapter. Don't ignore this! A little more practice will make it perfect.");
  }

  // 9. Performance Outperformed / Good Alert
  const outperformedMatch = translated.match(/has outperformed in '(.*?): (.*?)'/i);
  if (outperformedMatch) {
    const subject = outperformedMatch[1];
    const chapter = outperformedMatch[2];
    return t('notif_msg_outperformed_detail', { subject, chapter, defaultValue: `Wow! Outstanding performance in '${subject}: ${chapter}' this week!` });
  }
  if (/outstanding performance in this subject|outperformed/i.test(translated)) {
    return t('notif_msg_outperformance_alert', "Wow, outstanding performance in this subject! Keep up the amazing work!");
  }

  // 10. Parent Lesson Report
  const parentLessonMatch = translated.match(/(.+) just crushed Mission (\d+) (?:in chapter (.*?))?with (\d+)% accuracy!/i);
  if (parentLessonMatch) {
    const child = parentLessonMatch[1];
    const seq = parentLessonMatch[2];
    const acc = parentLessonMatch[4] || parentLessonMatch[3] || '90';
    return t('notif_msg_parent_lesson_crushed', { child, seq, acc, defaultValue: `${child} crushed Mission ${seq} with ${acc}% accuracy!` });
  }

  // 11. Textbook Chapter Read
  const pdfMatch = translated.match(/You completed reading textbook for chapter (.+)!/i);
  if (pdfMatch) {
    const chName = pdfMatch[1];
    return t('notif_msg_chapter_pdf_completed', { chapter: chName, defaultValue: `You completed reading textbook for chapter ${chName}!` });
  }

  // 12. Child Mission Completed
  translated = translated.replace(/You completed Mission (\d+)(?: in chapter [^\!\.]+)?[\!\.]?/i, (_, mSeq) => {
    return t('notif_mission_completed', { seq: mSeq, defaultValue: `You completed Mission ${mSeq}!` });
  });

  // 13. XP & Coins Bagged
  translated = translated.replace(/Bagged (\d+) XP & (\d+) Coins!/i, (_, xp, coins) => {
    return t('notif_bagged_rewards', { xp, coins, defaultValue: `Bagged ${xp} XP & ${coins} Coins!` });
  });

  // 14. Shadow Arena Defeated / Champion Win
  if (/beat their friend '?(.*?)'? in the Shadow Arena/i.test(translated) || /defeated '?(.*?)'? in Shadow Arena/i.test(translated)) {
    const match = translated.match(/beat their friend '?(.*?)'? in the Shadow Arena/i) || translated.match(/defeated '?(.*?)'? in Shadow Arena/i);
    const opp = match ? match[1] : "opponent";
    return t('notif_msg_shadow_champion_win', { opponent: opp, defaultValue: `Wow! You beat their friend '${opp}' in the Shadow Arena!` });
  }

  // 15. Boss Defeated
  if (/Fire Dragon Boss was defeated/i.test(translated)) {
    return t('notif_msg_boss_defeated', "The Fire Dragon Boss was defeated! You unlocked the Legendary Dragon Badge 🐲 Tap to view!");
  }

  // 16. Streak Emergency
  if (/Streak will BURST at midnight/i.test(translated)) {
    return t('notif_msg_streak_burst_midnight', "Your study streak will expire at midnight! 1 quick lesson saves it right now!");
  }

  // 17. Streak Expired & Revival Nudge
  const streakExpiredMatch = translated.match(/Your (\d+)-day streak expired yesterday! Tap to revive it for (\d+) coins/i);
  if (streakExpiredMatch) {
    const streak = streakExpiredMatch[1];
    const coins = streakExpiredMatch[2];
    return t('notif_msg_streak_expired_revive', { streak, coins, defaultValue: `Your ${streak}-day streak expired yesterday! Tap to revive it for ${coins} coins before it's gone forever 🔥` });
  }
  if (/streak expired yesterday|revive it for/i.test(translated)) {
    const streakM = translated.match(/(\d+)-day/i);
    const coinsM = translated.match(/(\d+)\s*coins/i);
    const streak = streakM ? streakM[1] : '3';
    const coins = coinsM ? coinsM[1] : '200';
    return t('notif_msg_streak_expired_revive', { streak, coins, defaultValue: `Your ${streak}-day streak expired yesterday! Tap to revive it for ${coins} coins before it's gone forever 🔥` });
  }

  // 18. Dragon Freezing / 3-Day Inactivity
  if (/dragon is freezing|haven't logged in for 3 days|egg loses warmth/i.test(translated)) {
    return t('notif_msg_dragon_freezing', "You haven't logged in for 3 days! Solve 1 quick question now before your egg loses warmth 🐉");
  }

  // 19. We Miss You
  if (/companion dragon is lonely|passing you on the leaderboard|we miss you/i.test(translated)) {
    return t('notif_msg_we_miss_you', "Your companion dragon is lonely & classmates are passing you on the Leaderboard! Tap to return 🚀");
  }

  // 20. Unclaimed Treasure / Mystery Box
  if (/unopened.*mystery box|unclaimed treasure/i.test(translated)) {
    return t('notif_msg_unclaimed_treasure', "You have 1 unopened Epic Mystery Box sitting in your inventory! Tap to unbox your reward 🎁");
  }

  // 21. Free Spin Ready
  if (/spin the lucky wheel today|free spin ready/i.test(translated)) {
    return t('notif_msg_free_spin_ready', "Spin the lucky wheel today to win 500 Coins or a Rare Dragon Egg 🥚 Tap to spin now!");
  }

  // 22. Dragon Hatching / Cracking Alert
  if (/dragon egg is 90% ready|hatch your baby dragon|cracking alert/i.test(translated)) {
    return t('notif_msg_cracking_alert', "Your Dragon Egg is 90% ready to hatch! Complete 1 lesson to hatch your Baby Dragon now 🐉");
  }

  // 23. Sunday Scholar Test
  if (/test your skills today|sunday scholar test/i.test(translated)) {
    return t('notif_msg_sunday_test', "Test your skills today to climb to Class Rank #1 & win 1000 Coins! 🏆");
  }

  return translated;
}

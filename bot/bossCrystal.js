/**
 * 달쮸 - !보스결정석 명령어
 *
 * 사용법
 *   !보스결정석            → 조회 가능한 보스 목록
 *   !보스결정석 스우        → 스우 노말/하드/익스트림 결정석 가격
 *
 * 가격 기준: KMS 2026.09.17 결정석 가격 조정 패치 (출처: 나무위키 등)
 * 가격이 바뀌면 아래 BOSS_CRYSTALS 의 숫자만 고치면 된다.
 */

var CRYSTAL_UPDATED = "2026.09.17 패치 기준";

// [난이도, 결정석 가격(메소)]
var BOSS_CRYSTALS = [
  { name: "스우", aliases: ["스우"], prices: [["노말", 8350000], ["하드", 48900000], ["익스트림", 545000000]] },
  { name: "데미안", aliases: ["데미안"], prices: [["노말", 8750000], ["하드", 46400000]] },
  { name: "가디언 엔젤 슬라임", aliases: ["가엔슬", "가디언엔젤슬라임", "슬라임"], prices: [["노말", 12700000], ["카오스", 71300000]] },
  { name: "루시드", aliases: ["루시드"], prices: [["이지", 14900000], ["노말", 17800000], ["하드", 59700000]] },
  { name: "윌", aliases: ["윌"], prices: [["이지", 16100000], ["노말", 20500000], ["하드", 73200000]] },
  { name: "더스크", aliases: ["더스크", "거대괴수더스크"], prices: [["노말", 22000000], ["카오스", 66300000]] },
  { name: "듄켈", aliases: ["듄켈", "친위대장듄켈"], prices: [["노말", 23700000], ["하드", 89600000]] },
  { name: "진 힐라", aliases: ["진힐라", "힐라"], prices: [["노말", 67600000], ["하드", 100000000]] },
  { name: "선택받은 세렌", aliases: ["세렌", "선택받은세렌"], prices: [["노말", 167000000], ["하드", 302000000], ["익스트림", 1840000000]] },
  { name: "감시자 칼로스", aliases: ["칼로스", "감시자칼로스"], prices: [["이지", 238000000], ["노말", 479000000], ["카오스", 1230000000], ["익스트림", 4104000000]] },
  { name: "카링", aliases: ["카링"], prices: [["이지", 320000000], ["노말", 576000000], ["하드", 1560000000], ["익스트림", 5387000000]] },
  { name: "최초의 대적자", aliases: ["대적자", "최초의대적자"], prices: [["이지", 261000000], ["노말", 532000000], ["하드", 1390000000], ["익스트림", 4712000000]] },
  { name: "림보", aliases: ["림보"], prices: [["노말", 995000000], ["하드", 2385000000]] },
  { name: "발드릭스", aliases: ["발드릭스"], prices: [["노말", 1320000000], ["하드", 3078000000]] },
  { name: "유피테르", aliases: ["유피테르"], prices: [["노말", 1560000000], ["하드", 4845000000]] },
  { name: "벨로나", aliases: ["벨로나"], prices: [["이지", 396000000], ["노말", 824000000], ["하드", 2950000000]] }
];

// 1234567890 → "12억 3,456만 7,890"
function formatMeso(n) {
  var eok = Math.floor(n / 100000000);
  var man = Math.floor((n % 100000000) / 10000);
  var rest = n % 10000;
  var parts = [];
  if (eok) parts.push(withComma(eok) + "억");
  if (man) parts.push(withComma(man) + "만");
  if (rest || !parts.length) parts.push(withComma(rest));
  return parts.join(" ");
}

function withComma(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function findBoss(query) {
  var q = query.replace(/\s+/g, "");
  for (var i = 0; i < BOSS_CRYSTALS.length; i++) {
    var boss = BOSS_CRYSTALS[i];
    for (var j = 0; j < boss.aliases.length; j++) {
      if (boss.aliases[j] === q) return boss;
    }
  }
  return null;
}

function bossListText() {
  var names = [];
  for (var i = 0; i < BOSS_CRYSTALS.length; i++) names.push(BOSS_CRYSTALS[i].aliases[0]);
  return "💎 보스 결정석 조회\n" +
    "사용법: !보스결정석 [보스명]\n\n" +
    "조회 가능 보스\n" + names.join(", ");
}

function bossCrystalText(boss) {
  var lines = ["💎 " + boss.name + " 결정석 가격"];
  for (var i = 0; i < boss.prices.length; i++) {
    lines.push("• " + boss.prices[i][0] + ": " + formatMeso(boss.prices[i][1]) + " 메소");
  }
  lines.push("", "(" + CRYSTAL_UPDATED + ")");
  return lines.join("\n");
}

/**
 * 메시지를 처리해 답장 문자열을 돌려준다. !보스결정석 명령이 아니면 null.
 */
function handleBossCrystal(msg) {
  var text = String(msg).trim();
  var m = text.match(/^!보스결정석(?:\s+(.+))?$/);
  if (!m) return null;
  if (!m[1]) return bossListText();
  var boss = findBoss(m[1]);
  if (!boss) return "❓ '" + m[1].trim() + "' 보스를 찾을 수 없어요.\n\n" + bossListText();
  return bossCrystalText(boss);
}

// 메신저봇R 레거시 API 진입점. 다른 스크립트에 합칠 때는 handleBossCrystal 만 가져다 쓰면 된다.
function response(room, msg, sender, isGroupChat, replier) {
  var reply = handleBossCrystal(msg);
  if (reply !== null) replier.reply(reply);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { handleBossCrystal: handleBossCrystal, formatMeso: formatMeso, BOSS_CRYSTALS: BOSS_CRYSTALS };
}

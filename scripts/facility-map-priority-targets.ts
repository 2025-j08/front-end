export type PriorityFacilityAction = 'add' | 'rename' | 'address-update' | 'pin-update';

export interface PriorityFacilityTarget {
  canonicalName: string;
  aliases: string[];
  corporation?: string;
  canonicalAddress: string;
  expectedActions: PriorityFacilityAction[];
  knownId?: number;
}

export const PRIORITY_FACILITY_TARGETS: PriorityFacilityTarget[] = [
  {
    canonicalName: '博愛社いずみ',
    aliases: ['児童養護施設 博愛社いずみ'],
    corporation: '社会福祉法人 博愛社',
    canonicalAddress: '大阪府大阪市淀川区十三元今里3-1-72',
    expectedActions: ['add'],
  },
  {
    canonicalName: '児童養護施設 あおぞら',
    aliases: ['あおぞら'],
    corporation: '社会福祉法人 阪南福祉事業会',
    canonicalAddress: '大阪府岸和田市三田町614-1',
    expectedActions: ['rename'],
    knownId: 34,
  },
  {
    canonicalName: '児童養護施設 あんだんて',
    aliases: ['あんだんて'],
    corporation: '社会福祉法人 阪南福祉事業会',
    canonicalAddress: '大阪府岸和田市三田町810-1',
    expectedActions: ['rename'],
    knownId: 35,
  },
  {
    canonicalName: '児童養護施設 慈教寮',
    aliases: ['女子慈教寮', '慈教寮'],
    corporation: '社会福祉法人 女子慈教寮',
    canonicalAddress: '大阪府和泉市池上町3-6-62',
    expectedActions: ['rename'],
    knownId: 46,
  },
  {
    canonicalName: '児童養護施設 いずみこどもの家',
    aliases: ['いずみこどもの家', '和泉幼児院'],
    corporation: '社会福祉法人 和泉乳児院',
    canonicalAddress: '大阪府泉大津市助松町3-8-7',
    expectedActions: ['rename'],
    knownId: 37,
  },
  {
    canonicalName: '遙学園',
    aliases: ['遥学園'],
    corporation: '社会福祉法人 大阪水上隣保館',
    canonicalAddress: '大阪府三島郡島本町山崎5-3-18',
    expectedActions: ['pin-update'],
    knownId: 55,
  },
  {
    canonicalName: '信愛学園',
    aliases: [],
    corporation: '社会福祉法人 信愛学園',
    canonicalAddress: '兵庫県神戸市東灘区御影3-28-1',
    expectedActions: ['pin-update'],
    knownId: 27,
  },
  {
    canonicalName: '神愛子供ホーム',
    aliases: [],
    corporation: '社会福祉法人 神愛子供ホーム',
    canonicalAddress: '兵庫県神戸市東灘区住吉山手4-7-35',
    expectedActions: ['pin-update'],
    knownId: 28,
  },
  {
    canonicalName: '双葉学園',
    aliases: [],
    corporation: '社会福祉法人 神戸協和会',
    canonicalAddress: '兵庫県神戸市灘区鶴甲1-5-1',
    expectedActions: ['pin-update'],
    knownId: 31,
  },
  {
    canonicalName: '神戸少年の町',
    aliases: [],
    corporation: '社会福祉法人 神戸少年の町',
    canonicalAddress: '兵庫県神戸市垂水区塩屋町梅木谷720',
    expectedActions: ['pin-update'],
    knownId: 25,
  },
  {
    canonicalName: '平安養育院',
    aliases: [],
    corporation: '社会福祉法人 平安養育院',
    canonicalAddress: '京都府京都市東山区林下町400-3',
    expectedActions: ['pin-update'],
    knownId: 102,
  },
  {
    canonicalName: '和敬学園',
    aliases: [],
    corporation: '社会福祉法人 衆善会',
    canonicalAddress: '京都府京都市上京区烏丸通寺ノ内上る東入相国寺門前町704',
    expectedActions: ['pin-update'],
    knownId: 104,
  },
  {
    canonicalName: '旭学園',
    aliases: ['和歌山市旭学園'],
    corporation: '社会福祉法人 和歌山社会事業協会',
    canonicalAddress: '和歌山県和歌山市冬野654-9',
    expectedActions: ['address-update', 'pin-update'],
    knownId: 84,
  },
];

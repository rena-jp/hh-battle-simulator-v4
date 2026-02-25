export interface LeagueBattleGlobal {
    hero_fighter:     HeroFighter;
    opponent_fighter: OpponentFighter;
}

export interface HeroFighter {
    caracs:                   HeroFighterCaracs;
    remaining_ego:            number;
    hitter_girl_id:           number;
    id_team:                  number;
    id_member:                number;
    slot_index:               number;
    theme:                    string;
    girls_ids:                number[];
    total_power:              number;
    girls:                    HeroFighterGirl[];
    synergies:                Synergy[];
    theme_elements:           ThemeElement[];
    power_display:            number;
    max_team_size:            number;
    min_team_size:            number;
    locked:                   boolean;
    selected_for_battle_type: string[];
}

export interface HeroFighterCaracs {
    ego:     number;
    damage:  number;
    defense: number;
    chance:  number;
}

export interface HeroFighterGirl {
    id_member:               number;
    id_girl:                 number;
    shards:                  number;
    level:                   number;
    fav_graded:              number;
    graded:                  number;
    ts_pay:                  number;
    affection:               number;
    xp:                      number;
    id_places_of_power:      null;
    date_added:              string;
    awakening_level:         number;
    girl:                    PurpleGirl;
    armor:                   ArmorElement[];
    salary:                  number;
    pay_time:                number;
    pay_in:                  number;
    caracs:                  BlessedCaracs;
    blessed_caracs:          BlessedCaracs;
    blessed_caracs_pvp4:     BlessedCaracs;
    caracs_sum:              number;
    blessed_attributes:      string[];
    can_be_blessed:          boolean;
    can_be_blessed_pvp4:     boolean;
    graded2:                 string;
    favorite_grade:          number;
    salary_per_hour:         number;
    ico:                     string;
    ava:                     string;
    level_cap:               number;
    awakening_costs:         number;
    is_owned:                boolean;
    affection_details:       AffectionDetails;
    xp_details:              PurpleXPDetails;
    skill_tiers_info:        { [key: string]: SkillTiersInfo };
    skills:                  { [key: string]: SkillValue };
    skill_trait:             string;
    skill_tiers_unlocked:    number[];
    battle_caracs:           BattleCaracs;
    power_display:           number;
    lively_scenes:           any[];
    member_grade_skins:      PurpleMemberGradeSkin[];
    grade_skins_stats_bonus: number;
    selected_grade_skin_num: null;
}

export interface AffectionDetails {
    cur:         number;
    level:       number;
    min:         number;
    max:         number;
    left:        number;
    ratio:       number;
    maxed:       boolean;
    can_upgrade: boolean;
}

export interface ArmorElement {
    id_girl_armor_equipped: number;
    id_member:              number;
    id_girl_item_armor:     number;
    id_item_skin:           number;
    id_variation:           number;
    level:                  number;
    id_girl:                number;
    caracs:                 ArmorCaracs;
    slot_index:             number;
    armor:                  ArmorArmor;
    skin:                   Skin;
    variation:              Variation;
    rarity:                 string;
    type:                   string;
    resonance_bonuses:      ResonanceBonuses;
}

export interface ArmorArmor {
    id_girl_item_armor: number;
    rarity:             string;
    carac1:             number;
    carac2:             number;
    carac3:             number;
    damage:             number;
    defense:            number;
    ego:                number;
}

export interface ArmorCaracs {
    carac1:  number;
    carac2:  number;
    carac3:  number;
    damage:  number;
    defense: number;
    ego:     number;
}

export interface ResonanceBonuses {
    class:   Class;
    element: Class;
    figure:  Class;
}

export interface Class {
    identifier: string;
    resonance:  string;
    bonus:      number;
}

export interface Skin {
    release_date: string;
    id_item_skin: number;
    id_skin_set:  number;
    identifier:   string;
    subtype:      number;
    wearer:       string;
    weight:       number;
    name:         string;
    ico:          string;
}

export interface Variation {
    id_variation:      number;
    rarity:            string;
    class:             number;
    class_resonance:   string;
    element:           string;
    element_resonance: string;
    figure:            number;
    figure_resonance:  string;
}

export interface BattleCaracs {
    ego:             number;
    damage:          number;
    defense:         number;
    chance:          number;
    speed:           number;
    mana_starting:   number;
    mana_generation: number;
}

export interface BlessedCaracs {
    carac1: number;
    carac2: number;
    carac3: number;
}

export interface PurpleGirl {
    id_girl:             number;
    id_girl_ref:         number;
    nb_grades:           number;
    class:               number;
    figure:              number;
    carac1:              number;
    carac2:              number;
    carac3:              number;
    rarity:              string;
    id_world:            number;
    id_quest_get:        number;
    name:                string;
    release_date:        string;
    upgrade_quests:      { [key: string]: number };
    hair_color1:         string;
    hair_color2:         string;
    eye_color1:          string;
    eye_color2:          string;
    zodiac:              string;
    element:             string;
    animated_grades:     AnimatedGrade[];
    anniversary:         string;
    grade_offset_values: Array<number[]>;
    preview_scenes:      Array<string[]>;
    blessing_bonuses:    { [key: string]: BlessingBonus };
    id_role:             number;
    role_data:           RoleData;
    element_data:        ThemeElement;
    is_released:         boolean;
    blessed_caracs:      BlessedCaracs;
    grade_offsets:       GradeOffsets;
    preview:             PurplePreview;
    default_avatar:      string;
    grade_skins:         number[];
    grade_skins_data:    GradeSkinsDatum[];
}

export interface AnimatedGrade {
    grade:    number;
    format:   string;
    path:     string;
    filename: string;
    asset:    string;
}

export interface BlessingBonus {
    carac1: number[];
    carac2: number[];
    carac3: number[];
}

export interface ThemeElement {
    type:                                     string;
    weakness:                                 string;
    domination:                               string;
    domination_ego_bonus_percent:             number;
    domination_damage_bonus_percent:          number;
    domination_critical_chance_bonus_percent: number;
    ico_url:                                  string;
    flavor:                                   string;
}

export interface GradeOffsets {
    static:   number[];
    animated: number[];
}

export interface GradeSkinsDatum {
    id_girl_grade_skin: number;
    id_girl:            number;
    num_order:          number;
    girl_grade_num:     number;
    type:               string;
    animation_format:   string;
    offset_values:      GradeOffsets;
    grade_skin_name:    string;
    image_path:         string;
    ico_path:           string;
    animation_infos:    AnimationInfos;
    release_date:       string;
    is_released:        boolean;
    is_owned:           boolean;
    shards_count:       number;
    is_selected:        number;
}

export interface AnimationInfos {
    path:     string;
    filename: string;
    asset:    string;
}

export interface PurplePreview {
    poses:         string[];
    scenes:        string[];
    lively_scenes: any[];
    position_img:  string;
}

export interface RoleData {
    id:          number;
    name:        string;
    flavour:     string;
    description: string;
}

export interface PurpleMemberGradeSkin {
    id_member_girl_grade_skin: number;
    id_member:                 number;
    id_girl:                   number;
    id_girl_grade_skin:        number;
    shards_count:              number;
    is_selected:               number;
    date_added:                string;
    is_owned:                  boolean;
}

export interface SkillTiersInfo {
    tier:              number;
    icon:              string;
    skill_points_used: number;
    icon_path:         string;
}

export interface SkillValue {
    id_member: number;
    id_girl:   number;
    id_skill:  number;
    level:     number;
    tier:      number;
    skill:     SkillSkill;
}

export interface SkillSkill {
    level:              number;
    class:              number;
    element:            string;
    rarity:             string;
    id_skill:           number;
    tier:               number;
    flat_value:         number | null;
    percentage_value:   number | null;
    display_value_text: string;
    description:        string;
    icon:               string;
    skill_type?:        string;
    named_attack_text?: string;
    is_used_in_battle?: boolean;
    name?:              string;
}

export interface PurpleXPDetails {
    cur:   number;
    min:   number;
    max:   number;
    level: number;
    left:  number;
    ratio: number;
    maxed: boolean;
}

export interface Synergy {
    element:                ThemeElement;
    team_girls_count:       number;
    harem_girls_count:      number;
    bonus_identifier:       string;
    team_bonus_per_girl:    number;
    harem_bonus_per_girl:   number;
    team_bonus_max_amount:  number;
    harem_bonus_max_amount: number;
    bonus_multiplier:       number;
    team_bonus_multiplier:  number;
    harem_bonus_multiplier: number;
}

export interface OpponentFighter {
    caracs:         HeroFighterCaracs;
    remaining_ego:  null;
    hitter_girl_id: number;
    id_team:        null;
    id_member:      null;
    slot_index:     null;
    theme:          string;
    girls_ids:      number[];
    total_power:    number;
    girls:          OpponentFighterGirl[];
    synergies:      Synergy[];
    theme_elements: any[];
    power_display:  number;
    max_team_size:  number;
    min_team_size:  number;
}

export interface OpponentFighterGirl {
    id_member:               number;
    id_girl:                 number;
    shards:                  null;
    level:                   number;
    fav_graded:              number;
    graded:                  number;
    ts_pay:                  null;
    affection:               null;
    xp:                      null;
    id_places_of_power:      null;
    date_added:              null;
    awakening_level:         number;
    girl:                    FluffyGirl;
    armor:                   ArmorElement[];
    salary:                  number;
    pay_time:                number;
    pay_in:                  number;
    caracs:                  BlessedCaracs;
    blessed_caracs:          BlessedCaracs;
    blessed_caracs_pvp4:     BlessedCaracs;
    caracs_sum:              number;
    blessed_attributes:      string[];
    can_be_blessed:          boolean;
    can_be_blessed_pvp4:     boolean;
    graded2:                 string;
    favorite_grade:          number;
    salary_per_hour:         number;
    ico:                     string;
    ava:                     string;
    level_cap:               number;
    awakening_costs:         number;
    is_owned:                boolean;
    affection_details:       AffectionDetails;
    xp_details:              FluffyXPDetails;
    skill_tiers_info:        { [key: string]: SkillTiersInfo };
    skills:                  { [key: string]: SkillValue };
    skill_trait:             string;
    skill_tiers_unlocked:    number[];
    battle_caracs:           BattleCaracs;
    power_display:           number;
    lively_scenes:           LivelyScene[];
    member_grade_skins:      FluffyMemberGradeSkin[];
    grade_skins_stats_bonus: number;
    selected_grade_skin_num: null;
}

export interface FluffyGirl {
    id_girl:             number;
    id_girl_ref:         number;
    nb_grades:           number;
    class:               number;
    figure:              number;
    carac1:              number;
    carac2:              number;
    carac3:              number;
    rarity:              string;
    id_world:            number;
    id_quest_get:        number;
    name:                string;
    release_date:        string;
    upgrade_quests:      { [key: string]: number };
    hair_color1:         string;
    hair_color2:         string;
    eye_color1:          string;
    eye_color2:          string;
    zodiac:              string;
    element:             string;
    animated_grades:     AnimatedGrade[];
    anniversary:         string;
    grade_offset_values: Array<number[]>;
    preview_scenes:      Array<string[]>;
    blessing_bonuses:    { [key: string]: BlessingBonus };
    id_role:             number;
    role_data:           RoleData;
    element_data:        ThemeElement;
    is_released:         boolean;
    blessed_caracs:      BlessedCaracs;
    grade_offsets:       GradeOffsets;
    preview:             FluffyPreview;
    default_avatar:      string;
    grade_skins:         number[];
    grade_skins_data:    GradeSkinsDatum[];
}

export interface FluffyPreview {
    poses:         string[];
    scenes:        string[];
    lively_scenes: LivelyScene[];
    position_img:  string;
}

export interface LivelyScene {
    id_lively_scene: number;
    id_girl:         number;
    order_num:       number;
    name:            string;
    is_unlocked:     boolean;
    content:         Content;
    release_date:    string;
}

export interface Content {
    image:          null | string;
    video:          null | string;
    image_censored: string;
    video_censored: string;
}

export interface FluffyMemberGradeSkin {
    id_member_girl_grade_skin: number;
    id_member:                 number;
    id_girl:                   number;
    id_girl_grade_skin:        number;
    shards_count:              number;
    is_selected:               number;
    date_added:                null;
    is_owned:                  boolean;
}

export interface FluffyXPDetails {
    cur:   number;
    min:   number;
    max:   number;
    level: number;
    left:  number;
    ratio: number;
    maxed: boolean;
}

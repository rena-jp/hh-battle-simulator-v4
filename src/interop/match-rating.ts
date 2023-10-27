import { afterGameInited } from '../utils/async';

export async function avoidOverlappingMatchRating() {
    await afterGameInited();

    const update = () => {
        if ($('.matchRating').length > 0) {
            $('.sim-result').addClass('sim-top');
        }
    };

    update();

    const observer = new MutationObserver(update);
    document.querySelectorAll('.player_team_block.opponent, .season_arena_opponent_container').forEach(e => {
        observer.observe(e, { childList: true, subtree: true });
    });
}

import { HeroType } from './data/hero';

export function getHero(window: Window): HeroType {
    return (window.Hero ?? window.shared?.Hero) as HeroType;
}

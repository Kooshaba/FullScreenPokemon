import { FullScreenPokemon } from "../../../../../../FullScreenPokemon";
import { IThing } from "../../../../../Things";
import { Move } from "../Move";

/**
 * Animates an Ember battle move.
 */
export class Ember<TEightBittr extends FullScreenPokemon> extends Move<TEightBittr> {
    /**
     * Runs the move's animation.
     *
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        const xPositions: number[] = new Array(3);
        let yPosition: number;

        if (this.direction === 1) {
            xPositions[0] = this.menu.left + (this.attackerThing.width * 3 + 4);
            xPositions[1] = xPositions[0] + (this.menu.left + xPositions[0]) / 30;
            xPositions[2] = xPositions[0] + (this.menu.left + xPositions[0]) / 60;
            yPosition = this.menu.bottom - (this.attackerThing.height * 2 - 4);
        } else {
            // These positions are incorrect and need to be updated. See issue #327
            xPositions[0] = this.menu.right - this.attackerThing.width / 2;
            yPosition = this.menu.top + this.attackerThing.height;
        }

        for (let i = 0; i < 3; i += 1) {
            this.eightBitter.timeHandler.addEvent(
                (): void => {
                    this.animateEmbers(xPositions[i], yPosition);
                },
                i * 24);
        }

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.battles.animations.things.shake({
                    callback,
                    clearTime: 4,
                    dx: 3,
                });
            },
            84);
    }

    /**
     * Creates a small and then a large ember.
     *
     * @param x   Horizontal midpoint of the embers.
     * @param y   Vertical midpoint of the embers.
     */
    private animateEmbers(x: number, y: number): void {
        this.createEmber("EmberSmall", x, y);

        this.eightBitter.timeHandler.addEvent(
                (): void => {
                    this.createEmber("EmberLarge", x, y);
                },
                6);
    }

    /**
     * Creates a flickering ember.
     *
     * @param title   Title of the ember's Thing.
     */
    private createEmber(title: "EmberSmall" | "EmberLarge", x: number, y: number): void {
        const ember: IThing = this.eightBitter.objectMaker.make<IThing>(title);

        this.eightBitter.things.add(ember, x + 4, y + 12);
        this.eightBitter.battles.animations.things.flicker({
            callback: (): void => this.eightBitter.death.killNormal(ember),
            thing: ember,
        });
    }
}

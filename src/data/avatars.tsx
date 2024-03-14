import { avataaars } from "@dicebear/collection"
import { Result, createAvatar } from "@dicebear/core"

const skins = ["ffdbb4", "f8d25c", "edb98a"]

const avatars: Record<string, Result> = {
	Gard: createAvatar(avataaars, {
		clothesColor: ["262e33"],
		clothing: ["hoodie"],
		eyebrows: ["angry"],
		eyes: ["eyeRoll"],
		facialHair: ["beardMajestic"],
		facialHairColor: ["2c1b18"],
		facialHairProbability: 100,
		mouth: ["serious"],
		skinColor: ["ffdbb4"],
		top: [],
	}),
	Jarle: createAvatar(avataaars, {
		clothesColor: ["65c9ff"],
		clothing: ["shirtCrewNeck"],
                clothingGraphic: ["cumbia"],
		eyebrows: ["raisedExcited"],
		eyes: ["happy"],
		facialHair: [],
		facialHairColor: ["2c1b18"],
		facialHairProbability: 0,
                hairColor: ["d6b370"],
		hatColor: ["ff488e"],
		mouth: ["smile"],
		skinColor: ["ffdbb4"],
		top: ["shortFlat"],
		topProbability: 100,
	}),
}

export const getAvatar = (name: string) => {
	const defaultAvatar = createAvatar(avataaars, {
		seed: name,
		skinColor: skins,
	})
	if (avatars[name]) {
		return avatars[name].toDataUriSync()
	}
	return defaultAvatar.toDataUriSync()
}

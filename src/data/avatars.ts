import { avataaars, adventurer, micah } from "@dicebear/collection"
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
	Hans: createAvatar(micah, {
		hair: ["fonze"],
		backgroundColor: ["transparent"],
		baseColor: ["ffdbb4"],
		hairColor: ["77331b"],
		mouth: ["smile"],
		shirt: ["collared"],
		shirtColor: ["6bd9e9"],
		facialHair: ["scruff"],
		facialHairColor: ["000000"],
		facialHairProbability: 100,
		eyes: ["eyesShadow"],
		eyebrows: ["up"],
	}),
	Katja: createAvatar(adventurer, {
		mouth: ["variant21"],
		hairColor: ["0e0e0e"],
		hair: ["long02"],
		skinColor: ["ffdbb4"],
		eyes: ["variant12"],
	}),
	"Thor-Eirik": createAvatar(avataaars, {
		top: ["shortCurly"],
		skinColor: ["ffdbb4"],
		mouth: ["twinkle"],
		hairColor: ["2c1b18"],
		eyes: ["surprised"],
		eyebrows: ["defaultNatural"],
		clothing: ["shirtCrewNeck"],
		clothesColor: ["3c4f5c"],
		accessories: ["prescription02"],
		accessoriesProbability: 100,
		accessoriesColor: ["231f20"],
	}),
}

export const getAvatar = (name: string) => {
	if (avatars[name]) {
		return avatars[name].toDataUri()
	}
	const defaultAvatar = createAvatar(adventurer, {
		seed: name,
		skinColor: skins,
	})
	return defaultAvatar.toDataUri()
}

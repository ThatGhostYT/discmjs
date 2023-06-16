import { DiscmCommand } from "discm.js";
import NodeGeocoder from "node-geocoder";
import getJson from "async-get-json";
import { API_KEY as apiKey } from "../config.json";

interface IssPositionResult{
    message: "success";
    iss_position: {
        longitude: string;
        latitude: string;
    }
    timestamp: number;
}

export default new DiscmCommand({
    type: "slash",
    description: "Gets the current city the international space station is in.",
    run: async ({ interaction }) => {
        const { iss_position } = await getJson("http://api.open-notify.org/iss-now.json") as IssPositionResult;

        const lon = Number(iss_position?.longitude);
        const lat = Number(iss_position?.latitude);

        const geocoder = NodeGeocoder({
            provider: "opencage",
            apiKey
        });

        const [res] = await geocoder.reverse({ lat, lon });

        let location = "the ocean";

        if(res?.city === undefined && res?.country !== undefined) location = `somewhere in ${res.country}`;
        else if(res?.country === "United States" && res?.city === undefined) location = `${res.state}, United States`;
        else if(res?.country === "United States" && res?.city !== undefined) location = `${res.city}, ${res.state} (United States)`;

        interaction.reply({
            content: `The ISS is currently flying over **${location}**.`,
            ephemeral: true
        });
    }
});
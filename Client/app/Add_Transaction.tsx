import { ThemedCard } from "@/components/ThemedCard";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedView } from "@/components/ThemedView";
export default function Index() {
  return (
    <ThemedSafeAreaView >
      <ThemedView className="!items-start pl-10 w-full mt-5">
        <ThemedText className="text-[20px] font-bold mb-2">Account</ThemedText>
      </ThemedView>
      <ThemedView className="!items-center w-full ">
        <ThemedScrollView vertical = {false} horizontal = {true} className="w-full">
          <ThemedView className="w-full overflow-x-scroll flex-row snap-x px-12">
            <ThemedCard mode="large" name="Wallet" balance="0.00" color="bg-red-500" className="snap-center"/>
            <ThemedCard mode="large" name="Bank" balance="0.00" color="bg-blue-500" className="snap-center" />
            <ThemedCard mode="large" name="Credit Card" balance="0.00" color="bg-orange-500" className="snap-center" />
          </ThemedView>
        </ThemedScrollView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
  
}

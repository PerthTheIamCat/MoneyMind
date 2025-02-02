import { ThemedCard } from "@/components/ThemedCard";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
export default function Index() {
  return (
    <ThemedSafeAreaView >
      <ThemedView className="!items-start pl-10 w-full mt-5">
        <ThemedText className="text-[20px] font-bold mb-10">Account</ThemedText>
      </ThemedView>
      <ThemedView className="!flex-row !justify-start !gap-5 !items-start !flex-wrap !px-10">
        <ThemedCard name="Wallet" balance="฿0.00" color="bg-[#F9A826]" />
        <ThemedCard name="Bank" balance="฿0.00" color="bg-[#2B9348]" />
        <ThemedCard name="Credit Card" balance="฿0.00" color="bg-[#C93540]" />
      </ThemedView>
    </ThemedSafeAreaView>
  );
  
}

<script>
  import {
    Briefcase,
    User,
    Heart,
    Dumbbell,
    DollarSign,
    GraduationCap,
    Home,
    Utensils,
    Repeat,
    Users,
    Tag,
  } from "lucide-svelte";

  export let icon = "Tag";
  export let size = 12;

  const iconMap = {
    Briefcase,
    User,
    Heart,
    Dumbbell,
    DollarSign,
    GraduationCap,
    Home,
    Utensils,
    Repeat,
    Users,
    Tag,
  };

  $: IconComponent = iconMap[icon] || Tag;
</script>

<svelte:component this="{IconComponent}" {size} />

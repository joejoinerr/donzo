<template>
    <h1 class="text-2xl mb-8 font-bold text-gray-600">{{ title }} ({{ incompleteActionsCount }})</h1>
    <nav v-if="props.actions.length > 0" class="mb-4">
        <button @click="clearFilters"
            class="leading-none rounded-full px-3 text-sm py-1 cursor-pointer mb-4 not-last:mr-2" :class="{
                'bg-white': anyFiltersActive,
                'bg-gray-500': !anyFiltersActive,
                'text-white': !anyFiltersActive,
            }">All</button>
        <select v-if="inUseEnergy.size" name="energy-filter" id="energy-filter"
            class="rounded-full leading-none px-3 text-sm py-1 cursor-pointer mb-4 not-last:mr-2"
            v-model="energyFilterActive" :class="{
                'bg-white': energyFilterActive === '',
                'bg-gray-500': energyFilterActive !== '',
                'text-white': energyFilterActive !== '',
            }">
            <option value="">Energy</option>
            <option v-for="[level, levelProper] in inUseEnergy" :key="level" :value="level">{{ levelProper }}</option>
        </select>
        <select name="time-filter" id="time-filter"
            class="rounded-full leading-none px-3 text-sm py-1 cursor-pointer mb-4 not-last:mr-2"
            v-model.number="timeFilterActive" :class="{
                'bg-white': timeFilterActive === -1,
                'bg-gray-500': timeFilterActive !== -1,
                'text-white': timeFilterActive !== -1,
            }">
            <option value="-1">Time</option>
            <option v-for="[mins, timeProper] in inUseTime" :key="mins" :value="mins">{{ timeProper }}</option>
        </select>
        <button v-for="tag in inUseTags" @click="filterTag(tag.lid)"
            class="leading-none rounded-full px-3 text-sm py-1 cursor-pointer mb-4 not-last:mr-2" :class="{
                'bg-white': !tagFiltersActive.includes(tag.lid),
                'bg-gray-500': tagFiltersActive.includes(tag.lid),
                'text-white': tagFiltersActive.includes(tag.lid),
            }">{{ tag.name }}</button>
    </nav>
    <ol v-if="incompleteActionsCount > 0" class="not-last:mb-8">
        <ActionListItem v-for="action in incompleteActions" :key="action.lid" :action="action" />
    </ol>
    <div v-if="completeActions.length > 0" class="not-last:mb-8">
        <h2 class="mb-3 font-bold text-gray-600">Done</h2>
        <ol>
            <ActionListItem v-for="action in completeActions" :key="action.lid" :action="action" />
        </ol>
    </div>
    <div v-if="viewEmpty" class="italic">No items to show right now</div>
</template>

<script setup>
import ActionListItem from '@/components/ActionListItem.vue';
import { computed } from 'vue';
import { useActionStore } from '@/stores/actionStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

// Set up component props

const actionStore = useActionStore();
const { tags } = storeToRefs(actionStore);

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    actions: {
        type: Array,
        default: () => []
    }
});

// Tag filtering logic

const inUseTags = computed(() => {
    // Filter tags that are actually used in the actions
    const filteredTags = props.actions.reduce((acc, action) => {
        action.tags?.forEach(tag => {
            if (!acc.includes(tag)) acc.push(tag);
        });
        return acc;
    }, []);
    return tags.value?.filter(tag => filteredTags.includes(tag.lid));
});
const inUseEnergy = computed(() => {
    // Get unique energy levels used in the actions
    let energyLevels = new Set(props.actions.map(action => action.energy).filter(Boolean));
    energyLevels = Array.from(energyLevels).sort((a, b) => {
        const levels = ['low', 'medium', 'high'];
        return levels.indexOf(a) - levels.indexOf(b);
    });
    const energyMap = new Map();
    energyLevels.forEach(level => {
        energyMap.set(level, level.charAt(0).toUpperCase() + level.slice(1));
    });
    return energyMap;
});
const inUseTime = computed(() => {
    // Get unique time values used in the actions
    let timeValues = new Set(props.actions.map(action => action.time).filter(Boolean));
    timeValues = Array.from(timeValues).sort((a, b) => a - b);
    const timeMap = new Map();
    timeValues.forEach(time => {
        timeMap.set(time, (time >= 60 ? time / 60 : time) + (time >= 60 ? 'h' : 'm'));
    });
    return timeMap;
});
const tagFiltersActive = ref([]);
const timeFilterActive = ref(-1);
const energyFilterActive = ref('');
const anyFiltersActive = computed(() => {
    return tagFiltersActive.value.length > 0 || timeFilterActive.value !== -1 || energyFilterActive.value !== '';
});

function filterTag(tagLid) {
    // Toggle tag filter
    if (tagFiltersActive.value.includes(tagLid)) {
        const i = tagFiltersActive.value.indexOf(tagLid);
        tagFiltersActive.value.splice(i, 1);
    } else {
        tagFiltersActive.value.push(tagLid);
    }
}

function clearFilters() {
    tagFiltersActive.value = [];
    timeFilterActive.value = -1;
    energyFilterActive.value = '';
}

const filteredActions = computed(() => {
    if (!anyFiltersActive.value) return props.actions;
    let filtered = props.actions;
    if (tagFiltersActive.value.length > 0) {
        // Filter actions by active tags
        filtered = props.actions.filter(action => {
            return action.tags?.some(tagLid => tagFiltersActive.value.includes(tagLid));
        });
    }
    if (timeFilterActive.value !== -1) {
        filtered = filtered.filter(action => action.time && action.time <= timeFilterActive.value);
    }
    if (energyFilterActive.value) {
        filtered = filtered.filter(action => action.energy === energyFilterActive.value);
    }
    return filtered;
});
const incompleteActions = computed(() => filteredActions.value?.filter(action => !action.completed) || []);
const completeActions = computed(() => filteredActions.value?.filter(action => action.completed) || []);
const incompleteActionsCount = computed(() => incompleteActions.value?.length || 0);
const viewEmpty = computed(() => (filteredActions.value?.length || 0) === 0);
</script>

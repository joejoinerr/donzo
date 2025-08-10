<template>
    <h1 class="text-2xl mb-8 font-bold text-gray-600">{{ title }} ({{ incompleteActionsCount }})</h1>
    <nav>
        <button @click="clearTagFilters" class="rounded-full px-3 text-sm py-1 cursor-pointer mb-4 not-last:mr-2"
            :class="{
                'bg-white': tagFiltersActive.length > 0,
                'bg-gray-500': tagFiltersActive.length === 0,
                'text-white': tagFiltersActive.length === 0,
            }">All</button>
        <button v-for="tag in inUseTags" @click="filterTag(tag.lid)"
            class="rounded-full px-3 text-sm py-1 cursor-pointer mb-4 not-last:mr-2" :class="{
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
const tagFiltersActive = ref([]);

function filterTag(tagLid) {
    // Toggle tag filter
    if (tagFiltersActive.value.includes(tagLid)) {
        const i = tagFiltersActive.value.indexOf(tagLid);
        tagFiltersActive.value.splice(i, 1);
    } else {
        tagFiltersActive.value.push(tagLid);
    }
}

function clearTagFilters() {
    tagFiltersActive.value = [];
}

// Actions filtering logic

const filteredActions = computed(() => {
    if (tagFiltersActive.value.length === 0) return props.actions;
    return props.actions.filter(action => {
        return action.tags.some(tagLid => tagFiltersActive.value.includes(tagLid));
    })
});
const incompleteActions = computed(() => filteredActions.value?.filter(action => !action.completed) || []);
const completeActions = computed(() => filteredActions.value?.filter(action => action.completed) || []);
const incompleteActionsCount = computed(() => incompleteActions.value?.length || 0);
const viewEmpty = computed(() => (filteredActions.value?.length || 0) === 0);
</script>

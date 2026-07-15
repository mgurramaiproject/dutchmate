# Popup review cards use a local canonical model

Status: accepted

The popup vocabulary review will present one canonical review card per Dutch learning word, assembled from the existing Dutch-English-Telugu translation pairs rather than treating each saved pair as a separate card. Existing partial cards remain reviewable with missing meanings shown clearly; the MVP does not perform automatic translation backfill. Optional page context is captured locally at save time and capped at 240 characters. New words remain separate from scheduled due reviews, and the toolbar badge counts only previously reviewed cards whose due time has arrived.

This preserves existing saved vocabulary, keeps learner data local, avoids duplicate cards, and keeps the MVP independent of new sentence-generation behavior or provider calls during review.

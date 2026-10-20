package com.meikaappan.server.service;

import com.meikaappan.server.entity.TrustedContactEntity;
import com.meikaappan.server.repository.TrustedContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class GuardianService {

    private final TrustedContactRepository contactRepository;

    public GuardianService(TrustedContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<TrustedContactEntity> getTrustedContacts() {
        return contactRepository.findByOrderByInvitedAtAsc();
    }

    public TrustedContactEntity addContact(TrustedContactEntity contact) {
        if (contact.getId() == null || contact.getId().trim().isEmpty()) {
            contact.setId("contact_" + System.currentTimeMillis());
        }
        if (contact.getInvitedAt() == null) {
            contact.setInvitedAt(Instant.now());
        }
        if (contact.getEmail() == null || contact.getEmail().trim().isEmpty()) {
            contact.setEmail(contact.getContactName() != null ?
                contact.getContactName().toLowerCase().replaceAll("[^a-z0-9]", "") + "@guardian.local" :
                "contact@" + contact.getId() + ".local");
        }
        return contactRepository.save(contact);
    }

    public Optional<TrustedContactEntity> updateConsent(String id, String status) {
        return contactRepository.findById(id).map(c -> {
            c.setConsentStatus(status);
            if ("ACCEPTED".equalsIgnoreCase(status) && c.getAcceptedAt() == null) {
                c.setAcceptedAt(Instant.now());
            }
            return contactRepository.save(c);
        });
    }

    public boolean removeContact(String id) {
        if (contactRepository.existsById(id)) {
            contactRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

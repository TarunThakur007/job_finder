package com.jobproof.service;

import com.jobproof.dto.JobDTO;
import com.jobproof.entity.Job;
import com.jobproof.entity.SavedJob;
import com.jobproof.entity.User;
import com.jobproof.mapper.JobMapper;
import com.jobproof.repository.JobRepository;
import com.jobproof.repository.SavedJobRepository;
import com.jobproof.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final JobMapper jobMapper;

    public SavedJobService(SavedJobRepository savedJobRepository, JobRepository jobRepository,
                           UserRepository userRepository, JobMapper jobMapper) {
        this.savedJobRepository = savedJobRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.jobMapper = jobMapper;
    }

    @Transactional
    public void saveJob(Long userId, Long jobId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));

        if (!savedJobRepository.existsByUserAndJob(user, job)) {
            savedJobRepository.save(SavedJob.builder().user(user).job(job).build());
        }
    }

    @Transactional
    public void removeSavedJob(Long userId, Long jobId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));

        savedJobRepository.deleteByUserAndJob(user, job);
    }

    @Transactional(readOnly = true)
    public List<JobDTO> getUserSavedJobs(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return savedJobRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(SavedJob::getJob)
                .map(jobMapper::toJobDTO)
                .collect(Collectors.toList());
    }
}
